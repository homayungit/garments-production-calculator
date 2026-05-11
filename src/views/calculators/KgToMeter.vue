<template>
  <CalcLayout>
    <template #header>
      <div class="mb-4">
        <h1 class="page-title">{{ t('calc.kgToMeter.icon') }} {{ t('calc.kgToMeter.title') }}</h1>
        <p class="page-subtitle">{{ t('calc.kgToMeter.desc') }}</p>
      </div>
    </template>

    <template #inputs>
      <div class="section-card mb-3">
        <div class="section-title">{{ t('sec.inputs') }}</div>
        <div class="space-y-3">
          <div>
            <label class="calc-label">{{ t('lbl.fabricWeight') }} <span class="text-red-500">*</span></label>
            <input v-model.number="form.kg" type="number" min="0" step="0.001" placeholder="e.g. 250" class="calc-input" />
          </div>
          <div>
            <label class="calc-label">{{ t('lbl.gsm') }} <span class="text-red-500">*</span></label>
            <input v-model.number="form.gsm" type="number" min="0" step="1" placeholder="e.g. 180" class="calc-input" />
          </div>
          <div>
            <label class="calc-label">{{ t('lbl.fabricWidth') }} <span class="text-red-500">*</span></label>
            <input v-model.number="form.width" type="number" min="0" step="1" placeholder="e.g. 160" class="calc-input" />
            <p class="calc-hint">{{ t('lbl.fabricWidthNote') }}</p>
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
          <div class="result-value">{{ result.meters }} m</div>
          <div class="result-label">{{ t('res.metersResult') }}</div>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div class="result-card">
            <div class="result-card-value">{{ result.yards }}</div>
            <div class="result-card-label">{{ t('res.yards') }}</div>
          </div>
          <div class="result-card">
            <div class="result-card-value">{{ result.sqMeters }}</div>
            <div class="result-card-label">{{ t('res.sqMeters') }}</div>
          </div>
        </div>
        <div class="formula-box">
          Meters = (kg × 1,000 × 100) / (GSM × Width_cm)<br>
          Yards = Meters × 1.09361
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
const form = reactive({ kg: null, gsm: null, width: null })
const result = ref(null)
const error = ref('')

function calculate() {
  error.value = ''; result.value = null
  const { kg, gsm, width } = form
  if (!kg || kg <= 0)       return (error.value = t('err.invalidKg'))
  if (!gsm || gsm <= 0)     return (error.value = t('err.invalidGSM'))
  if (!width || width <= 0) return (error.value = t('err.invalidFabricWidth'))
  const meters = (kg * 1000 * 100) / (gsm * width)
  result.value = { meters: parseFloat(meters.toFixed(3)), yards: parseFloat((meters * 1.09361).toFixed(3)), sqMeters: parseFloat((meters * width / 100).toFixed(3)) }
}
function reset() {
  form.kg = null; form.gsm = null; form.width = null
  result.value = null; error.value = ''
}
</script>
