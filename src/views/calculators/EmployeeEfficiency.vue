<template>
  <CalcLayout>
    <template #header>
      <div class="mb-4">
        <h1 class="page-title">{{ t('calc.empEff.icon') }} {{ t('calc.empEff.title') }}</h1>
        <p class="page-subtitle">{{ t('calc.empEff.desc') }}</p>
      </div>
    </template>

    <template #inputs>
      <div class="section-card mb-3">
        <div class="section-title">{{ t('sec.inputs') }}</div>
        <div class="space-y-3">
          <div>
            <label class="calc-label">{{ t('lbl.pieces') }} <span class="text-red-500">*</span></label>
            <input v-model.number="form.pieces" type="number" min="0" step="1" placeholder="e.g. 80" class="calc-input" />
          </div>
          <div>
            <label class="calc-label">{{ t('lbl.sam') }} <span class="text-red-500">*</span></label>
            <input v-model.number="form.sam" type="number" min="0" step="0.01" placeholder="e.g. 5.50" class="calc-input" />
          </div>
          <div>
            <label class="calc-label">{{ t('lbl.workingMinutes') }} <span class="text-red-500">*</span></label>
            <input v-model.number="form.minutes" type="number" min="0" step="1" placeholder="e.g. 480" class="calc-input" />
            <p class="calc-hint">{{ t('lbl.workingMinutesHint') }}</p>
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
          <div class="result-label">{{ t('res.empEfficiency') }}</div>
        </div>
        <div class="grid grid-cols-2 gap-2 mb-3">
          <div class="result-card">
            <div class="result-card-value">{{ result.samEarned }}</div>
            <div class="result-card-label">{{ t('res.samEarned') }}</div>
          </div>
          <div class="result-card">
            <div class="result-card-value">{{ result.target }}</div>
            <div class="result-card-label">{{ t('res.target') }}</div>
          </div>
        </div>
        <div class="progress-bar-wrap">
          <div class="h-2.5 rounded-full transition-all"
            :style="{ width: Math.min(result.efficiency, 100) + '%' }"
            :class="result.efficiency >= 80 ? 'bg-primary-500' : result.efficiency >= 60 ? 'bg-yellow-400' : 'bg-red-400'"/>
        </div>
        <div class="formula-box">
          SAM Earned = Pieces × SAM<br>
          Efficiency = (SAM Earned / Working Time) × 100<br>
          Target @ 100% = Working Time / SAM
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
const form = reactive({ pieces: null, sam: null, minutes: 480 })
const result = ref(null)
const error = ref('')

function calculate() {
  error.value = ''; result.value = null
  const { pieces, sam, minutes } = form
  if (!pieces || pieces < 0)    return (error.value = t('err.invalidPieces'))
  if (!sam || sam <= 0)         return (error.value = t('err.invalidSAM'))
  if (!minutes || minutes <= 0) return (error.value = t('err.invalidMinutes'))
  const samEarned = pieces * sam
  result.value = { samEarned: parseFloat(samEarned.toFixed(2)), efficiency: parseFloat(((samEarned / minutes) * 100).toFixed(2)), target: Math.round(minutes / sam) }
}

function reset() {
  form.pieces = null; form.sam = null; form.minutes = 480
  result.value = null; error.value = ''
}
</script>
