import React, { useRef, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ActiveUsersChartProps {
    activeCount: number;
    inactiveCount: number;
}

export default function ActiveUsersChart({ activeCount, inactiveCount }: ActiveUsersChartProps) {
    const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

    const options: Highcharts.Options = {
        chart: {
            type: 'pie',
            height: 280,
        },
        title: {
            text: undefined,
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        accessibility: {
            point: {
                valueSuffix: '%'
            }
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                },
                showInLegend: true
            }
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'Users',
            type: 'pie',
            data: [
                {
                    name: 'Active',
                    y: activeCount,
                    color: '#10b981', // Green
                },
                {
                    name: 'Inactive',
                    y: inactiveCount,
                    color: '#ef4444', // Red
                }
            ]
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
                <CardTitle className="text-lg">Active vs Inactive Users</CardTitle>
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