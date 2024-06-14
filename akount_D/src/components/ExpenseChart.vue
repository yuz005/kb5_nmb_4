<template>
    <div>
        <Bar :data="chartData" :options="chartOptions" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const props = defineProps({
    expenses: Object,
    income: Number
});

const chartData = computed(() => {
    return {
        labels: ['소비', '수입'],
        datasets: [
            {
                label: '카드 소비',
                backgroundColor: '#42A5F5',
                data: [Object.values(props.expenses.card).reduce((a, b) => a + b, 0), 0]
            },
            {
                label: '현금 소비',
                backgroundColor: '#66BB6A',
                data: [Object.values(props.expenses.cash).reduce((a, b) => a + b, 0), 0]
            },
            {
                label: '카드 수입',
                backgroundColor: '#FFA726',
                data: [0, props.income]
            }
        ]
    };
});

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            labels: {
                color: 'white', // 레전드 텍스트 색상
            }
        },
        title: {
            display: true,
            text: '소비 및 수입',
            color: 'white', // 타이틀 텍스트 색상
            font: {
                size: 20 // 타이틀 텍스트 크기
            }
        },
        tooltip: {
            bodyColor: 'white', // 툴팁 텍스트 색상
            titleColor: 'white',
        }
    },
    scales: {
        x: {
            stacked: true,
            ticks: {
                color: 'white' // x축 텍스트 색상
            }
        },
        y: {
            stacked: true,
            ticks: {
                color: 'white' // y축 텍스트 색상
            }
        }
    }
};

</script>

<style scoped>
div {
    height: 400px;
}
</style>
