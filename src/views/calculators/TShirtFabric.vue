<template>
  <CalcLayout>
    <template #header>
      <div class="mb-4">
        <h1 class="page-title">{{ t('calc.tshirt.icon') }} {{ t('calc.tshirt.title') }}</h1>
        <p class="page-subtitle">{{ t('calc.tshirt.desc') }}</p>
      </div>
    </template>

    <template #inputs>
      <div class="section-card mb-3">
        <div class="section-title">Measurements (cm)</div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="calc-label">{{ t('lbl.bodyLength') }} <span class="text-red-500">*</span></label>
            <input v-model.number="form.bodyLength" type="number" min="0" step="0.5" placeholder="e.g. 72" class="calc-input" />
          </div>
          <div>
            <label class="calc-label">{{ t('lbl.chest') }} <span class="text-red-500">*</span></label>
            <input v-model.number="form.chest" type="number" min="0" step="0.5" placeholder="e.g. 54" class="calc-input" />
            <p class="calc-hint">{{ t('lbl.chestHint') }}</p>
          </div>
          <div>
            <label class="calc-label">{{ t('lbl.sleeveLength') }} <span class="text-red-500">*</span></label>
            <input v-model.number="form.sleeveLength" type="number" min="0" step="0.5" placeholder="e.g. 22" class="calc-input" />
          </div>
          <div>
            <label class="calc-label">{{ t('lbl.sleeveWidth') }} <span class="text-red-500">*</span></label>
            <input v-model.number="form.sleeveWidth" type="number" min="0" step="0.5" placeholder="e.g. 20" class="calc-input" />
            <p class="calc-hint">{{ t('lbl.sleeveWidthHint') }}</p>
          </div>
        </div>
      </div>

      <div class="section-card mb-3">
        <div class="section-title">{{ t('sec.inputs') }}</div>
        <div class="space-y-3">
          <div>
            <label class="calc-label">{{ t('lbl.gsm') }} <span class="text-red-500">*</span></label>
            <input v-model.number="form.gsm" type="number" min="0" step="1" placeholder="e.g. 180" class="calc-input" />
          </div>
          <div>
            <label class="calc-label">{{ t('lbl.wastage') }} <span class="text-red-500">*</span></label>
            <input v-model.number="form.wastage" type="number" min="0" max="50" step="0.5" placeholder="e.g. 12" class="calc-input" />
            <p class="calc-hint">{{ t('lbl.wastageHint') }}</p>
          </div>
          <div>
            <label class="calc-label">{{ t('lbl.quantity') }} <span class="text-red-500">*</span></label>
            <input v-model.number="form.qty" type="number" min="1" step="1" placeholder="e.g. 1000" class="calc-input" />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2 mt-4">
          <button @click="calculate" class="calc-btn">{{ t('btn.calculate') }}</button>
          <button @click="reset" class="calc-btn-secondary">{{ t('btn.reset') }}</button>
        </div>
      </div>
    </template>

    <template #results>
      <div v-if="result" class="section-card">
        <div class="section-title">{{ t('sec.results') }}</div>
        <div class="grid grid-cols-2 gap-3 mb-3">
          <div class="result-box text-center">
            <div class="result-value">{{ result.gramsPerPiece }}</div>
            <div class="result-label">{{ t('res.gramsPerPiece') }}</div>
          </div>
          <div class="result-box text-center">
            <div class="result-value">{{ result.kgPerPiece }}</div>
            <div class="result-label">{{ t('res.kgPerPiece') }}</div>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div class="result-card">
            <div class="result-card-value">{{ result.totalKg }}</div>
            <div class="result-card-label">{{ t('res.totalKg') }}</div>
          </div>
          <div class="result-card">
            <div class="result-card-value">{{ result.totalKgWithWastage }}</div>
            <div class="result-card-label">{{ t('res.totalKgWithWastage') }}</div>
          </div>
        </div>
        <div class="formula-box">
          Body area = (Length+4) × (Chest+4) × 2 cm²<br>
          Sleeve area = (SL+3) × (SW+3) × 2 cm²<br>
          Fabric (g/pc) = Total area × GSM / 10,000<br>
          Total = g/pc × Qty × (1 + Wastage%) / 1000
        </div>
      </div>
      <div v-if="error" class="error-box mt-3">{{ error }}</div>
    </template>
  </CalcLayout>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useLang } from '../../composables/useLang.js'
import CalcLayout from '../../components/CalcLayout.vue'

const { t } = useLang()
const form = reactive({ bodyLength: null, chest: null, sleeveLength: null, sleeveWidth: null, gsm: null, wastage: 12, qty: 1 })
const result = ref(null)
const error = ref('')

function calculate() {
  error.value = ''; result.value = null
  const { bodyLength, chest, sleeveLength, sleeveWidth, gsm, wastage, qty } = form
  if (!bodyLength || !chest || !sleeveLength || !sleeveWidth) return (error.value = t('err.invalidMeasurements'))
  if (!gsm || gsm <= 0) return (error.value = t('err.invalidGSM'))
  if (wastage < 0)      return (error.value = t('err.invalidWastage'))
  if (!qty || qty <= 0) return (error.value = t('err.invalidQty'))
  const bodyArea   = (bodyLength + 4) * (chest + 4) * 2
  const sleeveArea = (sleeveLength + 3) * (sleeveWidth + 3) * 2
  const gramsPerPiece = ((bodyArea + sleeveArea) * gsm) / 10000
  const kgPerPiece    = gramsPerPiece / 1000
  result.value = {
    gramsPerPiece:      parseFloat(gramsPerPiece.toFixed(2)),
    kgPerPiece:         parseFloat(kgPerPiece.toFixed(4)),
    totalKg:            parseFloat((kgPerPiece * qty).toFixed(3)),
    totalKgWithWastage: parseFloat((kgPerPiece * qty * (1 + wastage / 100)).toFixed(3)),
  }
}
function reset() {
  Object.assign(form, { bodyLength: null, chest: null, sleeveLength: null, sleeveWidth: null, gsm: null, wastage: 12, qty: 1 })
  result.value = null; error.value = ''
}
</script>
