<template>
  <CalcLayout>
    <template #header>
      <div class="mb-4">
        <h1 class="page-title">{{ t('calc.lineSAH.icon') }} {{ t('calc.lineSAH.title') }}</h1>
        <p class="page-subtitle">{{ t('calc.lineSAH.desc') }}</p>
      </div>
    </template>

    <template #inputs>
      <div class="section-card mb-3">
        <div class="section-title">{{ t('sec.inputs') }}</div>
        <div class="space-y-3">
          <div>
            <label class="calc-label">{{ t('lbl.pieces') }} <span class="text-red-500">*</span></label>
            <input v-model.number="form.pieces" type="number" min="0" step="1" placeholder="e.g. 500" class="calc-input" />
          </div>
          <div>
            <label class="calc-label">{{ t('lbl.sam') }} <span class="text-red-500">*</span></label>
            <input v-model.number="form.sam" type="number" min="0" step="0.01" placeholder="e.g. 25.50" class="calc-input" />
          </div>
          <div>
            <label class="calc-label">{{ t('lbl.operators') }} <span class="text-gray-400 text-xs font-normal">({{ t('lbl.daysOptional').replace('(optional)', '').trim() }})</span></label>
            <input v-model.number="form.operators" type="number" min="0" step="1" placeholder="e.g. 30" class="calc-input" />
          </div>
          <div>
            <label class="calc-label">{{ t('lbl.workingHours') }} <span class="text-gray-400 text-xs font-normal">(optional)</span></label>
            <input v-model.number="form.hours" type="number" min="0" step="0.5" placeholder="e.g. 8" class="calc-input" />
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
        <div class="result-box text-center mb-3">
          <div class="result-value">{{ result.sah }}</div>
          <div class="result-label">{{ t('res.sah') }}</div>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div class="result-card">
            <div class="result-card-value">{{ result.samEarned }}</div>
            <div class="result-card-label">{{ t('res.samEarned') }}</div>
          </div>
          <div v-if="result.efficiency !== null" class="result-card">
            <div class="result-card-value">{{ result.efficiency }}%</div>
            <div class="result-card-label">{{ t('res.lineEfficiency') }}</div>
          </div>
        </div>
        <div class="formula-box">
          SAM Earned = Pieces × SAM<br>
          SAH = SAM Earned / 60<br>
          <span v-if="result.efficiency !== null">Efficiency = SAH / (Operators × Hours) × 100</span>
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
const form = reactive({ pieces: null, sam: null, operators: null, hours: null })
const result = ref(null)
const error = ref('')

function calculate() {
  error.value = ''; result.value = null
  const { pieces, sam, operators, hours } = form
  if (!pieces || pieces < 0) return (error.value = t('err.invalidPieces'))
  if (!sam || sam <= 0)      return (error.value = t('err.invalidSAM'))
  const samEarned = pieces * sam
  const sah = samEarned / 60
  const efficiency = (operators > 0 && hours > 0) ? parseFloat(((sah / (operators * hours)) * 100).toFixed(2)) : null
  result.value = { samEarned: parseFloat(samEarned.toFixed(2)), sah: parseFloat(sah.toFixed(2)), efficiency }
}

function reset() {
  form.pieces = null; form.sam = null; form.operators = null; form.hours = null
  result.value = null; error.value = ''
}
</script>
