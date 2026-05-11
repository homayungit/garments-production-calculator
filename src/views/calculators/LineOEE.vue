<template>
  <CalcLayout>
    <template #header>
      <div class="mb-4">
        <h1 class="page-title">{{ t('calc.lineOEE.icon') }} {{ t('calc.lineOEE.title') }}</h1>
        <p class="page-subtitle">{{ t('calc.lineOEE.desc') }}</p>
      </div>
    </template>

    <template #inputs>
      <div class="section-card mb-3">
        <div class="section-title">{{ t('res.availability') }}</div>
        <div class="space-y-3">
          <div>
            <label class="calc-label">{{ t('lbl.plannedTime') }} <span class="text-red-500">*</span></label>
            <input v-model.number="form.plannedTime" type="number" min="0" step="1" placeholder="e.g. 480" class="calc-input" />
          </div>
          <div>
            <label class="calc-label">{{ t('lbl.downtime') }} <span class="text-red-500">*</span></label>
            <input v-model.number="form.downtime" type="number" min="0" step="1" placeholder="e.g. 30" class="calc-input" />
          </div>
        </div>
      </div>

      <div class="section-card mb-3">
        <div class="section-title">{{ t('res.performance') }}</div>
        <div class="space-y-3">
          <div>
            <label class="calc-label">{{ t('lbl.idealCycleTime') }} <span class="text-red-500">*</span></label>
            <input v-model.number="form.sam" type="number" min="0" step="0.01" placeholder="e.g. 12.5" class="calc-input" />
          </div>
          <div>
            <label class="calc-label">{{ t('lbl.actualOutput') }} <span class="text-red-500">*</span></label>
            <input v-model.number="form.actualOutput" type="number" min="0" step="1" placeholder="e.g. 320" class="calc-input" />
          </div>
        </div>
      </div>

      <div class="section-card mb-3">
        <div class="section-title">{{ t('res.quality') }}</div>
        <div>
          <label class="calc-label">{{ t('lbl.goodUnits') }} <span class="text-red-500">*</span></label>
          <input v-model.number="form.goodUnits" type="number" min="0" step="1" placeholder="e.g. 310" class="calc-input" />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-2 mb-3">
        <button @click="calculate" class="calc-btn">{{ t('btn.calculate') }}</button>
        <button @click="reset" class="calc-btn-secondary">{{ t('btn.reset') }}</button>
      </div>
    </template>

    <template #results>
      <div v-if="result" class="section-card">
        <div class="section-title">{{ t('sec.results') }}</div>
        <div class="result-box text-center mb-3">
          <div class="result-value">{{ result.oee }}%</div>
          <div class="result-label">{{ t('res.oee') }}</div>
        </div>
        <div class="grid grid-cols-3 gap-2 mb-3">
          <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-2.5 text-center">
            <div class="text-lg font-bold text-blue-700 dark:text-blue-400">{{ result.availability }}%</div>
            <div class="text-[10px] text-blue-500 dark:text-blue-500 mt-0.5">{{ t('res.availability') }}</div>
          </div>
          <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-2.5 text-center">
            <div class="text-lg font-bold text-yellow-700 dark:text-yellow-400">{{ result.performance }}%</div>
            <div class="text-[10px] text-yellow-600 dark:text-yellow-500 mt-0.5">{{ t('res.performance') }}</div>
          </div>
          <div class="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-2.5 text-center">
            <div class="text-lg font-bold text-purple-700 dark:text-purple-400">{{ result.quality }}%</div>
            <div class="text-[10px] text-purple-600 dark:text-purple-500 mt-0.5">{{ t('res.quality') }}</div>
          </div>
        </div>
        <div class="progress-bar-wrap">
          <div class="h-2.5 rounded-full transition-all"
            :style="{ width: Math.min(result.oee, 100) + '%' }"
            :class="result.oee >= 85 ? 'bg-primary-500' : result.oee >= 60 ? 'bg-yellow-400' : 'bg-red-400'"/>
        </div>
        <p class="text-xs text-center mt-1 font-semibold"
          :class="result.oee >= 85 ? 'text-primary-600 dark:text-primary-400' : result.oee >= 60 ? 'text-yellow-600' : 'text-red-600'">
          {{ result.oee >= 85 ? t('rating.worldClass') : result.oee >= 60 ? t('rating.acceptable') : t('rating.needsImprovement') }}
        </p>
        <div class="formula-box">
          Availability = ((Planned − Downtime) / Planned) × 100<br>
          Performance = (Output × SAM / Run Time) × 100<br>
          Quality = (Good Units / Total) × 100<br>
          OEE = (A × P × Q) / 10,000
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
const form = reactive({ plannedTime: null, downtime: 0, sam: null, actualOutput: null, goodUnits: null })
const result = ref(null)
const error = ref('')

function calculate() {
  error.value = ''; result.value = null
  const { plannedTime, downtime, sam, actualOutput, goodUnits } = form
  if (!plannedTime || plannedTime <= 0)          return (error.value = t('err.invalidPlannedTime'))
  if (downtime < 0 || downtime >= plannedTime)   return (error.value = t('err.invalidDowntime'))
  if (!sam || sam <= 0)                          return (error.value = t('err.invalidSAM'))
  if (!actualOutput || actualOutput < 0)         return (error.value = t('err.invalidOutput'))
  if (!goodUnits || goodUnits < 0)               return (error.value = t('err.invalidOutput'))
  if (goodUnits > actualOutput)                  return (error.value = t('err.invalidGoodUnits'))
  const runTime = plannedTime - downtime
  const availability = (runTime / plannedTime) * 100
  const performance  = (actualOutput * sam / runTime) * 100
  const quality      = (goodUnits / actualOutput) * 100
  const oee          = (availability * performance * quality) / 10000
  result.value = { availability: parseFloat(availability.toFixed(2)), performance: parseFloat(Math.min(performance, 100).toFixed(2)), quality: parseFloat(quality.toFixed(2)), oee: parseFloat(oee.toFixed(2)) }
}

function reset() {
  form.plannedTime = null; form.downtime = 0; form.sam = null; form.actualOutput = null; form.goodUnits = null
  result.value = null; error.value = ''
}
</script>
