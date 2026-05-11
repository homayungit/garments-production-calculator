<template>
  <CalcLayout>
    <template #header>
      <div class="mb-4">
        <h1 class="page-title">{{ t('calc.lineEff.icon') }} {{ t('calc.lineEff.title') }}</h1>
        <p class="page-subtitle">{{ t('calc.lineEff.desc') }}</p>
      </div>
    </template>

    <template #inputs>
      <div class="section-card mb-3">
        <div class="section-title">{{ t('sec.inputs') }}</div>
        <div class="space-y-3">
          <div>
            <label class="calc-label">{{ t('lbl.operators') }} <span class="text-red-500">*</span></label>
            <input v-model.number="form.operators" type="number" min="1" step="1" placeholder="e.g. 30" class="calc-input" />
          </div>
          <div>
            <label class="calc-label">{{ t('lbl.workingHours') }} <span class="text-red-500">*</span></label>
            <input v-model.number="form.hours" type="number" min="0" step="0.5" placeholder="e.g. 8" class="calc-input" />
          </div>
          <div>
            <label class="calc-label">{{ t('lbl.pieces') }} <span class="text-red-500">*</span></label>
            <input v-model.number="form.pieces" type="number" min="0" step="1" placeholder="e.g. 450" class="calc-input" />
          </div>
          <div>
            <label class="calc-label">{{ t('lbl.sam') }} <span class="text-red-500">*</span></label>
            <input v-model.number="form.sam" type="number" min="0" step="0.01" placeholder="e.g. 25.50" class="calc-input" />
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
          <div class="result-value">{{ result.efficiency }}%</div>
          <div class="result-label">{{ t('res.lineEfficiency') }}</div>
        </div>
        <div class="grid grid-cols-2 gap-2 mb-3">
          <div class="result-card">
            <div class="result-card-value">{{ result.minutesProduced }}</div>
            <div class="result-card-label">{{ t('res.minutesProduced') }}</div>
          </div>
          <div class="result-card">
            <div class="result-card-value">{{ result.minutesAvailable }}</div>
            <div class="result-card-label">{{ t('res.minutesAvailable') }}</div>
          </div>
        </div>
        <div class="progress-bar-wrap">
          <div class="h-2.5 rounded-full transition-all duration-500"
            :style="{ width: Math.min(result.efficiency, 100) + '%' }"
            :class="result.efficiency >= 80 ? 'bg-primary-500' : result.efficiency >= 60 ? 'bg-yellow-400' : 'bg-red-400'"/>
        </div>
        <p class="text-xs text-center mt-1 font-semibold"
          :class="result.efficiency >= 80 ? 'text-primary-600 dark:text-primary-400' : result.efficiency >= 60 ? 'text-yellow-600' : 'text-red-600'">
          {{ result.efficiency >= 80 ? t('rating.good') : result.efficiency >= 60 ? t('rating.average') : t('rating.needsImprovement') }}
        </p>
        <div class="formula-box">
          Minutes Produced = Pieces × SAM<br>
          Minutes Available = Operators × Hours × 60<br>
          Efficiency = (Minutes Produced / Minutes Available) × 100
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
const form = reactive({ operators: null, hours: 8, pieces: null, sam: null })
const result = ref(null)
const error = ref('')

function calculate() {
  error.value = ''; result.value = null
  const { operators, hours, pieces, sam } = form
  if (!operators || operators <= 0) return (error.value = t('err.invalidOperators'))
  if (!hours || hours <= 0)         return (error.value = t('err.invalidHours'))
  if (!pieces || pieces < 0)        return (error.value = t('err.invalidPieces'))
  if (!sam || sam <= 0)             return (error.value = t('err.invalidSAM'))
  const minutesProduced  = pieces * sam
  const minutesAvailable = operators * hours * 60
  const efficiency = (minutesProduced / minutesAvailable) * 100
  result.value = { minutesProduced: Math.round(minutesProduced), minutesAvailable: Math.round(minutesAvailable), efficiency: parseFloat(efficiency.toFixed(2)) }
}

function reset() {
  form.operators = null; form.hours = 8; form.pieces = null; form.sam = null
  result.value = null; error.value = ''
}
</script>
