<template>
  <CalcLayout>
    <template #header>
      <div class="mb-4">
        <h1 class="page-title">{{ t('calc.sam.icon') }} {{ t('calc.sam.title') }}</h1>
        <p class="page-subtitle">{{ t('calc.sam.desc') }}</p>
      </div>
    </template>

    <template #inputs>
      <div class="section-card mb-3">
        <div class="section-title">{{ t('sec.inputs') }}</div>
        <div class="space-y-3">
          <div>
            <label class="calc-label">{{ t('lbl.observedTime') }} <span class="text-red-500">*</span></label>
            <input v-model.number="form.observedTime" type="number" min="0" step="0.01" placeholder="e.g. 0.85" class="calc-input" />
            <p class="calc-hint">{{ t('lbl.observedTimeHint') }}</p>
          </div>
          <div>
            <label class="calc-label">{{ t('lbl.rating') }} <span class="text-red-500">*</span></label>
            <input v-model.number="form.rating" type="number" min="0" max="200" step="1" placeholder="e.g. 100" class="calc-input" />
            <p class="calc-hint">{{ t('lbl.ratingHint') }}</p>
          </div>
          <div>
            <label class="calc-label">{{ t('lbl.allowance') }} <span class="text-red-500">*</span></label>
            <input v-model.number="form.allowance" type="number" min="0" max="50" step="0.5" placeholder="e.g. 10" class="calc-input" />
            <p class="calc-hint">{{ t('lbl.allowanceHint') }}</p>
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
        <div class="grid grid-cols-2 gap-3">
          <div class="result-box text-center">
            <div class="result-value">{{ result.normalTime }}</div>
            <div class="result-label">{{ t('res.normalTime') }}</div>
          </div>
          <div class="result-box text-center">
            <div class="result-value">{{ result.sam }}</div>
            <div class="result-label">{{ t('res.sam') }}</div>
          </div>
        </div>
        <div class="formula-box">
          <span class="font-bold">{{ t('sec.formulas') }}</span><br>
          Normal Time = Observed Time × (Rating / 100)<br>
          SAM = Normal Time × (1 + Allowance / 100)
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
const form = reactive({ observedTime: null, rating: 100, allowance: 10 })
const result = ref(null)
const error = ref('')

function calculate() {
  error.value = ''; result.value = null
  const { observedTime, rating, allowance } = form
  if (!observedTime || observedTime <= 0) return (error.value = t('err.invalidObs'))
  if (!rating || rating <= 0)             return (error.value = t('err.invalidRating'))
  if (allowance < 0)                      return (error.value = t('err.invalidAllowance'))
  const normalTime = observedTime * (rating / 100)
  const sam = normalTime * (1 + allowance / 100)
  result.value = { normalTime: normalTime.toFixed(4), sam: sam.toFixed(4) }
}

function reset() {
  form.observedTime = null; form.rating = 100; form.allowance = 10
  result.value = null; error.value = ''
}
</script>
