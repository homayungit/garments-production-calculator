<template>
  <CalcLayout>
    <template #header>
      <div class="mb-4">
        <h1 class="page-title">{{ t('calc.woven.icon') }} {{ t('calc.woven.title') }}</h1>
        <p class="page-subtitle">{{ t('calc.woven.desc') }}</p>
      </div>
    </template>

    <template #inputs>
      <div class="section-card mb-3">
        <div class="section-title">Measurements (cm)</div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="calc-label">{{ t('lbl.bodyLength') }} <span class="text-red-500">*</span></label>
            <input v-model.number="form.bodyLength" type="number" min="0" step="0.5" placeholder="e.g. 75" class="calc-input" />
          </div>
          <div>
            <label class="calc-label">{{ t('lbl.chest') }} <span class="text-red-500">*</span></label>
            <input v-model.number="form.chest" type="number" min="0" step="0.5" placeholder="e.g. 52" class="calc-input" />
            <p class="calc-hint">{{ t('lbl.chestHint') }}</p>
          </div>
          <div>
            <label class="calc-label">{{ t('lbl.sleeveLength') }} <span class="text-red-500">*</span></label>
            <input v-model.number="form.sleeveLength" type="number" min="0" step="0.5" placeholder="e.g. 64" class="calc-input" />
          </div>
          <div>
            <label class="calc-label">{{ t('lbl.sleeveWidth') }} <span class="text-red-500">*</span></label>
            <input v-model.number="form.sleeveWidth" type="number" min="0" step="0.5" placeholder="e.g. 22" class="calc-input" />
          </div>
          <div>
            <label class="calc-label">{{ t('lbl.collar') }}</label>
            <input v-model.number="form.collar" type="number" min="0" step="0.5" placeholder="e.g. 8" class="calc-input" />
          </div>
          <div>
            <label class="calc-label">{{ t('lbl.cuff') }}</label>
            <input v-model.number="form.cuff" type="number" min="0" step="0.5" placeholder="e.g. 7" class="calc-input" />
          </div>
        </div>
      </div>

      <div class="section-card mb-3">
        <div class="section-title">{{ t('sec.inputs') }}</div>
        <div class="space-y-3">
          <div>
            <label class="calc-label">{{ t('lbl.fabricWidth') }} <span class="text-red-500">*</span></label>
            <input v-model.number="form.fabricWidth" type="number" min="0" step="1" placeholder="e.g. 150" class="calc-input" />
            <p class="calc-hint">{{ t('lbl.fabricWidthHint') }}</p>
          </div>
          <div>
            <label class="calc-label">{{ t('lbl.markerEff') }} <span class="text-red-500">*</span></label>
            <input v-model.number="form.markerEff" type="number" min="50" max="100" step="1" placeholder="e.g. 85" class="calc-input" />
            <p class="calc-hint">{{ t('lbl.markerEffHint') }}</p>
          </div>
          <div>
            <label class="calc-label">{{ t('lbl.wastage') }} <span class="text-red-500">*</span></label>
            <input v-model.number="form.wastage" type="number" min="0" max="30" step="0.5" placeholder="e.g. 8" class="calc-input" />
          </div>
          <div>
            <label class="calc-label">{{ t('lbl.quantity') }} <span class="text-red-500">*</span></label>
            <input v-model.number="form.qty" type="number" min="1" step="1" placeholder="e.g. 500" class="calc-input" />
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
            <div class="result-value">{{ result.metersPerPiece }}</div>
            <div class="result-label">{{ t('res.metersPerPiece') }}</div>
          </div>
          <div class="result-box text-center">
            <div class="result-value">{{ result.metersWithWastage }}</div>
            <div class="result-label">{{ t('res.metersWithWastage') }}</div>
          </div>
        </div>
        <div class="result-card">
          <div class="result-card-value text-2xl">{{ result.totalMeters }} m</div>
          <div class="result-card-label">{{ t('res.totalMeters') }} ({{ form.qty }} pcs)</div>
        </div>
        <div class="formula-box">
          Net area = Body (2×(L+6)×(C×2+8)) + Sleeve (2×(SL+6)×(SW×2+6)) + collar + cuff<br>
          Meters/pc = Net area / (fabric width × marker eff%) / 100<br>
          Total = Meters/pc × (1 + wastage%) × Qty
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
const form = reactive({ bodyLength: null, chest: null, sleeveLength: null, sleeveWidth: null, collar: 8, cuff: 7, fabricWidth: null, markerEff: 85, wastage: 8, qty: 1 })
const result = ref(null)
const error = ref('')

function calculate() {
  error.value = ''; result.value = null
  const { bodyLength, chest, sleeveLength, sleeveWidth, collar, cuff, fabricWidth, markerEff, wastage, qty } = form
  if (!bodyLength || !chest || !sleeveLength || !sleeveWidth) return (error.value = t('err.invalidMeasurements'))
  if (!fabricWidth || fabricWidth <= 0) return (error.value = t('err.invalidFabricWidth'))
  if (!markerEff || markerEff <= 0)     return (error.value = t('err.invalidMarkerEff'))
  if (!qty || qty <= 0)                 return (error.value = t('err.invalidQty'))
  const bodyArea   = 2 * (bodyLength + 6) * (chest * 2 + 8)
  const sleeveArea = 2 * (sleeveLength + 6) * (sleeveWidth * 2 + 6)
  const collarArea = (collar || 0) * (chest + 4) * 2
  const cuffArea   = (cuff || 0) * 30 * 2
  const totalArea  = bodyArea + sleeveArea + collarArea + cuffArea
  const metersPerPiece    = totalArea / ((fabricWidth * (markerEff / 100)) * 100)
  const metersWithWastage = metersPerPiece * (1 + wastage / 100)
  result.value = {
    metersPerPiece:     parseFloat(metersPerPiece.toFixed(3)),
    metersWithWastage:  parseFloat(metersWithWastage.toFixed(3)),
    totalMeters:        parseFloat((metersWithWastage * qty).toFixed(2)),
  }
}
function reset() {
  Object.assign(form, { bodyLength: null, chest: null, sleeveLength: null, sleeveWidth: null, collar: 8, cuff: 7, fabricWidth: null, markerEff: 85, wastage: 8, qty: 1 })
  result.value = null; error.value = ''
}
</script>
