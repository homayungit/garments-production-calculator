<template>
  <CalcLayout>
    <template #header>
      <div class="mb-4">
        <h1 class="page-title">{{ t('calc.meterToKg.icon') }} {{ t('calc.meterToKg.title') }}</h1>
        <p class="page-subtitle">{{ t('calc.meterToKg.desc') }}</p>
      </div>
    </template>

    <template #inputs>
      <div class="section-card mb-3">
        <div class="section-title">{{ t('sec.inputs') }}</div>
        <div class="space-y-3">
          <div>
            <label class="calc-label">{{ t('lbl.fabricLength') }} <span class="text-red-500">*</span></label>
            <input v-model.number="form.meters" type="number" min="0" step="0.001" placeholder="e.g. 500" class="calc-input" />
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
          <div class="result-value">{{ result.kg }} kg</div>
          <div class="result-label">{{ t('res.kgResult') }}</div>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div class="result-card">
            <div class="result-card-value">{{ result.grams }}</div>
            <div class="result-card-label">{{ t('res.grams') }}</div>
          </div>
          <div class="result-card">
            <div class="result-card-value">{{ result.sqMeters }}</div>
            <div class="result-card-label">{{ t('res.sqMeters') }}</div>
          </div>
        </div>
        <div class="formula-box">
          Kg = (Meters × GSM × Width_cm) / 100,000
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
const form = reactive({ meters: null, gsm: null, width: null })
const result = ref(null)
const error = ref('')

function calculate() {
  error.value = ''; result.value = null
  const { meters, gsm, width } = form
  if (!meters || meters <= 0) return (error.value = t('err.invalidMeters'))
  if (!gsm || gsm <= 0)       return (error.value = t('err.invalidGSM'))
  if (!width || width <= 0)   return (error.value = t('err.invalidFabricWidth'))
  const sqMeters = meters * (width / 100)
  const grams    = sqMeters * gsm
  result.value = { sqMeters: parseFloat(sqMeters.toFixed(3)), grams: parseFloat(grams.toFixed(2)), kg: parseFloat((grams / 1000).toFixed(3)) }
}
function reset() {
  form.meters = null; form.gsm = null; form.width = null
  result.value = null; error.value = ''
}
</script>
