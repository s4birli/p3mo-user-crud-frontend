import React, { useRef, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MonthlyRegistrationsChartProps {
    monthlyRegistrations: {
        month: string;
        count: number;
    }[];
}

export default function MonthlyRegistrationsChart({ monthlyRegistrations }: MonthlyRegistrationsChartProps) {
    const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

    // Format months for display
    const months = monthlyRegistrations.map(item => {
        const [year, month] = item.month.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1);
        return date.toLocaleString('default', { month: 'short', year: 'numeric' });
    });

    const counts = monthlyRegistrations.map(item => item.count);

    const options: Highcharts.Options = {
        chart: {
            type: 'line',
            height: 280,
        },
        title: {
            text: undefined,
        },
        xAxis: {
            categories: months,
            title: {
                text: 'Month'
            }
        },
        yAxis: {
            title: {
                text: 'New Registrations'
            },
            min: 0
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y}</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            line: {
                marker: {
                    enabled: true
                }
            }
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'New Users',
            type: 'line',
            data: counts,
            color: '#6366f1' // Indigo
        } as Highcharts.SeriesOptionsType]
    };

    // Update chart on window resize
    useEffect(() => {
        const handleResize = () => {
            if (chartComponentRef.current) {
                chartComponentRef.current.chart.reflow();
            }
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-lg">Monthly User Registrations</CardTitle>
            </CardHeader>
            <CardContent>
                <HighchartsReact
                    highcharts={Highcharts}
                    options={options}
                    ref={chartComponentRef}
                />
            </CardContent>
        </Card>
    );
} 