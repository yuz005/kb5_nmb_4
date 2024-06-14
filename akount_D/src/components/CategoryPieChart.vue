<template>
    <div>
        <Pie :data="chartData" :options="chartOptions" />
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const props = defineProps({
    categories: Array,
    expenses: Object
});

const chartData = computed(() => {
    const labels = props.categories.map(category => category.title);
    const totalData = props.categories.map(category => {
        const cardTotal = props.expenses.card[category.id] || 0;
        const cashTotal = props.expenses.cash[category.id] || 0;
        return cardTotal + cashTotal;
    });

    return {
        labels,
        datasets: [
            {
                label: '소비 비율',
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40'
                ],
                data: totalData
            }
        ]
    };
});

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false
};
</script>

<style scoped>
div {
    height: 400px;
    width: 400px;
    margin: auto;
}
</style>
