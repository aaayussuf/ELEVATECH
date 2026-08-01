import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
);

export default function SalesChart({ data }) {

    return (

        <Line

            data={{

                labels:data.labels,

                datasets:[{

                    label:"Sales",

                    data:data.values,

                    tension:.4,

                    fill:true,

                }]

            }}

        />

    );

}