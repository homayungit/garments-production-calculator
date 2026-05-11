<template>
  <CalcLayout>
    <template #header>
      <div class="mb-4">
        <h1 class="page-title">{{ t('calc.labourProd.icon') }} {{ t('calc.labourProd.title') }}</h1>
        <p class="page-subtitle">{{ t('calc.labourProd.desc') }}</p>
      </div>
    </template>

    <template #inputs>
      <div class="section-card mb-3">
        <div class="section-title">{{ t('sec.inputs') }}</div>
        <div class="space-y-3">
          <div>
            <label class="calc-label">{{ t('lbl.totalOutput') }} <span class="text-red-500">*</span></label>
            <input v-model.number="form.output" type="number" min="0" step="1" placeholder="e.g. 5000" class="calc-input" />
          </div>
          <div>
            <label class="calc-label">{{ t('lbl.workers') }} <span class="text-red-500">*</span></label>
            <input v-model.number="form.workers" type="number" min="1" step="1" placeholder="e.g. 50" class="calc-input" />
          </div>
          <div>
            <label class="calc-label">{{ t('lbl.workingDays') }} <span class="text-red-500">*</span></label>
            <input v-model.number="form.days" type="number" min="1" step="1" placeholder="e.g. 26" class="calc-input" />
          </div>
          <div>
            <label class="calc-label">{{ t('lbl.hoursPerDay') }}</label>
            <input v-model.number="form.hours" type="number" min="1" step="0.5" placeholder="e.g. 8" class="calc-input" />
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
          <div class="result-value">{{ result.perPersonPerDay }}</div>
          <div class="result-label">{{ t('res.perPersonPerDay') }}</div>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div class="result-card">
            <div class="result-card-value">{{ result.perPersonPerHour }}</div>
            <div class="result-card-label">{{ t('res.perPersonPerHour') }}</div>
          </div>
          <div class="result-card">
            <div class="result-card-value">{{ result.perPersonTotal }}</div>
            <div class="result-card-label">{{ t('res.perPersonTotal') }}</div>
          </div>
        </div>
        <div class="formula-box">
          Per Person / Day = Total Output / (Workers × Days)<br>
          Per Person / Hour = Per Person / Day / Hours
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
const form = reactive({ output: null, workers: null, days: null, hours: 8 })
const result = ref(null)
const error = ref('')

function calculate() {
  error.value = ''; result.value = null
  const { output, workers, days, hours } = form
  if (!output || output < 0)    return (error.value = t('err.invalidOutput'))
  if (!workers || workers <= 0) return (error.value = t('err.invalidWorkers'))
  if (!days || days <= 0)       return (error.value = t('err.invalidDays'))
  const perPersonTotal  = output / workers
  const perPersonPerDay = perPersonTotal / days
  result.value = { perPersonTotal: parseFloat(perPersonTotal.toFixed(2)), perPersonPerDay: parseFloat(perPersonPerDay.toFixed(2)), perPersonPerHour: hours > 0 ? parseFloat((perPersonPerDay / hours).toFixed(2)) : '—' }
}

function reset() {
  form.output = null; form.workers = null; form.days = null; form.hours = 8
  result.value = null; error.value = ''
}
</script>
