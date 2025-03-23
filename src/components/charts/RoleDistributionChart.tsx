import React, { useRef, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RoleDistributionChartProps {
    roleDistribution: {
        Admin: number;
        User: number;
        Guest: number;
    };
}

export default function RoleDistributionChart({ roleDistribution }: RoleDistributionChartProps) {
    const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

    const options: Highcharts.Options = {
        chart: {
            type: 'column',
            height: 280,
        },
        title: {
            text: undefined,
        },
        xAxis: {
            categories: ['Admin', 'User', 'Guest'],
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Number of Users'
            }
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
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'Roles',
            type: 'column',
            data: [
                {
                    name: 'Admin',
                    y: roleDistribution.Admin,
                    color: '#3b82f6', // Blue
                },
                {
                    name: 'User',
                    y: roleDistribution.User,
                    color: '#10b981', // Green
                },
                {
                    name: 'Guest',
                    y: roleDistribution.Guest,
                    color: '#f59e0b', // Yellow
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
                <CardTitle className="text-lg">Role Distribution</CardTitle>
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