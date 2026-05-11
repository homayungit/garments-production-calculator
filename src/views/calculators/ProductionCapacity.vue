<template>
  <CalcLayout>
    <template #header>
      <div class="mb-4">
        <h1 class="page-title">{{ t('calc.prodCap.icon') }} {{ t('calc.prodCap.title') }}</h1>
        <p class="page-subtitle">{{ t('calc.prodCap.desc') }}</p>
      </div>
    </template>

    <template #inputs>
      <div class="section-card mb-3">
        <div class="section-title">{{ t('sec.inputs') }}</div>
        <div class="space-y-3">
          <div>
            <label class="calc-label">{{ t('lbl.operators') }} <span class="text-red-500">*</span></label>
            <input v-model.number="form.operators" type="number" min="1" step="1" placeholder="e.g. 35" class="calc-input" />
          </div>
          <div>
            <label class="calc-label">{{ t('lbl.workingHours') }} <span class="text-red-500">*</span></label>
            <input v-model.number="form.hours" type="number" min="0" step="0.5" placeholder="e.g. 8" class="calc-input" />
          </div>
          <div>
            <label class="calc-label">{{ t('lbl.sam') }} <span class="text-red-500">*</span></label>
            <input v-model.number="form.sam" type="number" min="0" step="0.01" placeholder="e.g. 25.50" class="calc-input" />
          </div>
          <div>
            <label class="calc-label">{{ t('lbl.efficiency') }} <span class="text-red-500">*</span></label>
            <input v-model.number="form.efficiency" type="number" min="1" max="100" step="1" placeholder="e.g. 75" class="calc-input" />
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
          <div class="result-value">{{ result.capacity }}</div>
          <div class="result-label">{{ t('res.capacity') }} ({{ form.efficiency }}%)</div>
        </div>
        <div class="grid grid-cols-3 gap-2">
          <div class="result-card">
            <div class="result-card-value">{{ result.perHour }}</div>
            <div class="result-card-label">{{ t('res.perHour') }}</div>
          </div>
          <div class="result-card">
            <div class="result-card-value">{{ result.capacityAt100 }}</div>
            <div class="result-card-label">{{ t('res.capacityAt100') }}</div>
          </div>
          <div class="result-card">
            <div class="result-card-value">{{ result.availMinutes }}</div>
            <div class="result-card-label">{{ t('res.availMinutes') }}</div>
          </div>
        </div>
        <div class="formula-box">
          Capacity = (Operators × Hours × 60 × Efficiency%) / (SAM × 100)
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
const form = reactive({ operators: null, hours: 8, sam: null, efficiency: 75 })
const result = ref(null)
const error = ref('')

function calculate() {
  error.value = ''; result.value = null
  const { operators, hours, sam, efficiency } = form
  if (!operators || operators <= 0)                        return (error.value = t('err.invalidOperators'))
  if (!hours || hours <= 0)                               return (error.value = t('err.invalidHours'))
  if (!sam || sam <= 0)                                   return (error.value = t('err.invalidSAM'))
  if (!efficiency || efficiency <= 0 || efficiency > 100) return (error.value = t('err.invalidEfficiency'))
  const availMinutes = operators * hours * 60
  const capacity     = (availMinutes * efficiency) / (sam * 100)
  result.value = { availMinutes: Math.round(availMinutes), capacity: Math.round(capacity), capacityAt100: Math.round(availMinutes / sam), perHour: parseFloat((capacity / hours).toFixed(1)) }
}

function reset() {
  form.operators = null; form.hours = 8; form.sam = null; form.efficiency = 75
  result.value = null; error.value = ''
}
</script>
