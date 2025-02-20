/* eslint-disable react/prop-types */
import { Box } from '@chakra-ui/react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale, Filler } from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend, Filler);

const ClassLineGraph = ({ classPoints }) => {
    // Process the data to group points by date
    const pointsByDate = classPoints.reduce((acc, record) => {
        acc[record.date] = (acc[record.date] || 0) + record.points;
        return acc;
    }, {});

    // Sort dates in ascending order
    const sortedDates = Object.keys(pointsByDate).sort();

    const gradientFill = (context) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(54, 162, 235, 0.6)');
        gradient.addColorStop(1, 'rgba(54, 162, 235, 0)'); 
        return gradient;
    };

    const chartData = {
        labels: sortedDates, 
        datasets: [
            {
                label: 'Total Clovers Earned',
                data: sortedDates.map(date => pointsByDate[date]),
                borderColor: '#36A2EB',
                backgroundColor: gradientFill,
                borderWidth: 3,
                tension: 0.4,
                pointRadius: 5,
                pointBackgroundColor: '#36A2EB',
                pointBorderColor: '#fff',
                pointHoverRadius: 8,
                fill: true,
            },
        ],
    };

    // Chart options
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    font: {
                        size: 12,
                        family: 'Sora, sans-serif',
                        weight: 'bold',
                    },
                    color: '#4A5568',
                },
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleFont: { size: 12, family: 'Sora, sans-serif' },
                bodyFont: { size: 12, family: 'Sora, sans-serif' },
                bodyColor: '#fff',
                titleColor: '#fff',
                displayColors: false,
                callbacks: {
                    label: (context) => ` ${context.raw} Clovers`,
                },
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Date',
                    font: { size: 12, family: 'Sora, sans-serif', weight: 'bold' },
                    color: '#4A5568',
                },
                grid: {
                    display: false, // Hide x-axis grid lines
                },
                ticks: {
                    font: { size: 12, family: 'Sora, sans-serif' },
                    color: '#718096',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Clovers',
                    font: { size: 12, family: 'Sora, sans-serif', weight: 'bold' },
                    color: '#4A5568',
                },
                grid: {
                    color: '#E2E8F0',
                    borderDash: [5],
                },
                ticks: {
                    font: { size: 12, family: 'Sora, sans-serif' },
                    color: '#718096',
                },
                beginAtZero: true,
            },
        },
        animation: {
            duration: 1500,
            easing: 'easeInOutQuart',
        },
    };

    return (
        <Box w="100%" h="100%">
            <Line data={chartData} options={chartOptions} />
        </Box>
    );
};

export default ClassLineGraph;