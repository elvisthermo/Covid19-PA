async function read_dataset() {
    const data_covid = await d3.csv("./datasets/mapeamento-casos-confirmados-no-para.csv");

    return data_covid;
}

async function start() {
    let para_covid = await read_dataset();



    let data_local = para_covid.map((d, i) => {
        return d.LOCAL;
    });

    data_local = [...new Set(data_local)];

    let count_by_local = [];

    for (let i = 0; i < data_local.length; i++) {
        let comunitario = 0, importado = 0, local = 0;
        let count = 0;
        let status_local;
        for (let j = 0; j < para_covid.length; j++) {
            if (data_local[i] === para_covid[j].LOCAL) {
                if (status_local = para_covid[j].STATUS === "IMPORTADO") {
                    importado++;
                }
                else if (status_local = para_covid[j].STATUS === "LOCAL") {
                    local++;
                }
                else if (status_local = para_covid[j].STATUS === "COMUNITARIA") {
                    comunitario++;
                }
                count += 1;
            }

        }
        count_by_local.push({ "LOCAL": data_local[i], "QTD": count, "qtd_importado": importado, "qtd_local": local, "qtd_comunidade": comunitario });

    }

    parallel = new vistechlib.CirclePacking(document.getElementById("group"), { labelVAlign: "top", labelHAlign: "right" });


    parallel.hierarchy(["LOCAL"]);
    parallel.setSize("IDADE");


    parallel.data(para_covid);

    let colors = ["#66aa00", "#b82e2e", "#316395", "#994499", "#3b3eac", "#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477"];



    parallel.setColor(function (d, i) {
        if (d.data["GENERO"] === "H") {
            return "steelblue";
        } else {
            return "#cc78ab";
        }

    });

    parallel.setInteractionMode(false);

    parallel
        .redraw()
        .on("datamouseover", function (d, i) {
            parallel.highlight(d, i);

            let x = event.clientX + window.scrollX;
            let y = event.clientY + window.scrollY;

            document.getElementById("legend").style.display = "block";
            document.getElementById("legend").style.left = x + "px";
            document.getElementById("legend").style.top = y + "px";


            let text_details = document.createElement("p");
            text_details.setAttribute("id", "text_details");
            let node_text = document.createTextNode(
                "idade:" + d.data.IDADE + "/" +
                "sexo:" + d.data.GENERO + "/" +
                "local:" + d.data.LOCAL + "/" +
                "status:" + d.data.STATUS);

            text_details.appendChild(node_text);
            document.getElementById("details").appendChild(text_details);


        })
        .on("datamouseout", function (d, i) {
            parallel.removeHighlight(d, i);

            document.getElementById("legend").style.display = "none";
            let elemet = document.getElementById("text_details");
            elemet.remove();

        })
        .on("highlightstart", function (d, i) {
            
        })
        .on("dataclick", function (d, i) {

        });

    let ctx = document.getElementById('vis1').getContext('2d');
    let myChart = new Chart(ctx, {
        type: 'bar',
        responsive: false,
        data: {
            labels: data_local,
            datasets: [{
                label: [
                    "numero de casos",
                ],
                data: count_by_local.map((d) => { return d.QTD }),
                backgroundColor: [
                    '#66c2a5',
                    '#fc8d62',
                    '#8da0cb',
                    '#e78ac3',
                    '#a6d854',
                    '#ffd92f',
                    "#e5c494",
                    "#b3b3b3"
                ],
                borderColor:
                    "#pink"
                ,
                borderWidth: 1
            }]
        },
        options: {
            title: {
                display: true,
                text: 'Quantidade de casos por municípios do Pará'
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            responsive: true,
            maintainAspectRatio: false,
            legend: { position: 'top' },
        },

    });

    let ctx_2 = document.getElementById("vis2").getContext('2d');
    let myChart_2 = new Chart(ctx_2, {
        type: 'bar',
        data: {
            labels: data_local,
            datasets: [{
                label: 'casos de contaminação local',
                backgroundColor: "#e15759",
                data: count_by_local.map((d) => { return d.qtd_importado }),
            }, {
                label: 'casos de viagem do exterior',
                backgroundColor: "#bc80bd",
                data: count_by_local.map((d) => { return d.qtd_local }),
            }, {
                label: 'comunitário',
                backgroundColor: "#edc949",
                data: count_by_local.map((d) => { return d.qtd_comunidade }),
            }],
        },
        borderColor:
            "#pink"
        ,
        options: {
            scales: {
                xAxes: [{
                    stacked: true,
                    gridLines: {

                    }
                }],
                yAxes: [{
                    stacked: true,
                    ticks: {
                        beginAtZero: true,
                    },
                    type: 'linear',
                }]
            },
            title: {
                display: true,
                text: 'Quantidade de casos por municípios do Pará e forma de contaminação'
            },
            responsive: true,
            maintainAspectRatio: false,
            legend: { position: 'top' },
        }
    });

    myChart.canvas.parentNode.style.height = '250px';
    myChart_2.canvas.parentNode.style.height = '250px';
    // myChart.canvas.parentNode.style.width = '500px';
    // myChart_2.canvas.parentNode.style.width = '500px';


    let textnode = document.createTextNode(para_covid.length);
    document.getElementById("number_comfirm").appendChild(textnode);

}

start();

