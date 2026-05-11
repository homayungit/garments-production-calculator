<template>
  <CalcLayout>
    <template #header>
      <div class="mb-4">
        <h1 class="page-title">{{ t('calc.hourly.icon') }} {{ t('calc.hourly.title') }}</h1>
        <p class="page-subtitle">{{ t('calc.hourly.desc') }}</p>
      </div>
    </template>

    <template #inputs>
      <div class="section-card mb-3">
        <div class="section-title">{{ t('sec.inputs') }}</div>
        <div class="space-y-3">
          <div>
            <label class="calc-label">{{ t('lbl.sam') }} <span class="text-red-500">*</span></label>
            <input v-model.number="form.sam" type="number" min="0" step="0.01" placeholder="e.g. 12.5" class="calc-input" />
          </div>
          <div>
            <label class="calc-label">{{ t('lbl.efficiency') }} <span class="text-red-500">*</span></label>
            <input v-model.number="form.efficiency" type="number" min="1" max="100" step="1" placeholder="e.g. 75" class="calc-input" />
          </div>
          <div>
            <label class="calc-label">{{ t('lbl.operators') }} <span class="text-gray-400 text-xs font-normal">(optional)</span></label>
            <input v-model.number="form.operators" type="number" min="0" step="1" placeholder="e.g. 30" class="calc-input" />
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
            <div class="result-value">{{ result.perOperatorHour }}</div>
            <div class="result-label">{{ t('res.perOperatorHour') }}</div>
          </div>
          <div v-if="result.lineHourlyTarget" class="result-box text-center">
            <div class="result-value">{{ result.lineHourlyTarget }}</div>
            <div class="result-label">{{ t('res.lineHourlyTarget') }}</div>
          </div>
        </div>
        <div class="result-card">
          <div class="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-2">{{ t('res.dailyTargets') }}</div>
          <div class="grid grid-cols-2 gap-2">
            <div class="text-center">
              <div class="text-xl font-bold text-gray-700 dark:text-slate-200">{{ result.dailyPerOperator }}</div>
              <div class="text-xs text-gray-400 dark:text-slate-500">{{ t('res.dailyPerOperator') }}</div>
            </div>
            <div v-if="result.dailyLine" class="text-center">
              <div class="text-xl font-bold text-gray-700 dark:text-slate-200">{{ result.dailyLine }}</div>
              <div class="text-xs text-gray-400 dark:text-slate-500">{{ t('res.dailyLine') }}</div>
            </div>
          </div>
        </div>
        <div class="formula-box">
          Per Operator / Hour = (60 / SAM) × (Efficiency / 100)<br>
          Line Target / Hour = Per Operator × Operators
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
const form = reactive({ sam: null, efficiency: 75, operators: null })
const result = ref(null)
const error = ref('')

function calculate() {
  error.value = ''; result.value = null
  const { sam, efficiency, operators } = form
  if (!sam || sam <= 0)                                   return (error.value = t('err.invalidSAM'))
  if (!efficiency || efficiency <= 0 || efficiency > 100) return (error.value = t('err.invalidEfficiency'))
  const perOperatorHour = (60 / sam) * (efficiency / 100)
  const dailyPerOperator = perOperatorHour * 8
  const lineHourlyTarget = operators > 0 ? parseFloat((perOperatorHour * operators).toFixed(1)) : null
  result.value = { perOperatorHour: parseFloat(perOperatorHour.toFixed(2)), dailyPerOperator: Math.round(dailyPerOperator), lineHourlyTarget, dailyLine: operators > 0 ? Math.round(dailyPerOperator * operators) : null }
}

function reset() {
  form.sam = null; form.efficiency = 75; form.operators = null
  result.value = null; error.value = ''
}
</script>
