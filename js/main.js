async function read_confirmed_cases() {
    const data_covid = await d3.csv("./datasets/mapeamento-casos-confirmados-no-para.csv");

    return data_covid;
}

async function read_death_cases() {
    const data_covid = await d3.csv("./datasets/mapeamento-obitos-confirmados-no-para.csv");

    return data_covid;
}

async function start() {
    let para_covid = await read_confirmed_cases();

    let para_death_covid = await read_death_cases();

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
                } else if (status_local = para_covid[j].STATUS === "LOCAL") {
                    local++;
                } else if (status_local = para_covid[j].STATUS === "COMUNITARIA") {
                    comunitario++;
                }
                count += 1;
            }

        }
        count_by_local.push({
            "LOCAL": data_local[i],
            "QTD": count,
            "qtd_importado": importado,
            "qtd_local": local,
            "qtd_comunidade": comunitario
        });

    }

    circle_packing = new vistechlib.CirclePacking(document.getElementById("group"), {
        labelVAlign: "top",
        labelHAlign: "right"
    });


    circle_packing.hierarchy(["LOCAL"]);
    circle_packing.setSize("IDADE");


    circle_packing.data(para_covid);

    let colors = ["#66aa00", "#b82e2e", "#316395", "#994499", "#3b3eac", "#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477"];


    circle_packing.setColor(function (d, i) {
        if (d.data["GENERO"] === "H") {
            return "steelblue";
        } else {
            return "#cc78ab";
        }

    });

    circle_packing.setInteractionMode(false);

    circle_packing
        .redraw()
        .on("datamouseover", function (d, i) {
            circle_packing.highlight(d, i);

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
            circle_packing.removeHighlight(d, i);

            document.getElementById("legend").style.display = "none";
            let elemet = document.getElementById("text_details");
            elemet.remove();

        })
        .on("highlightstart", function (d, i) {

        })
        .on("dataclick", function (d, i) {

        });

    console.log("aqui", count_by_local);

    let barchart =
        {
            title: 'Casos confirmados por município do Pará',
            width: "container",
            data: {
                values: para_covid
            },

            "encoding": {
                "color": {"value": "#e15759"},
                "y": {"field": "LOCAL", "type": "ordinal", "sort": "ascending"},
                "x": {"field": "LOCAL", "aggregate": "count", "type": "quantitative"}
            },
            "config": {
                "countTitle": "QUANTIDADE DE CASO",
                "axisX": {"titleLimit": 150},
            },
            "layer": [{
                "mark": {
                    "type": "bar",
                    "tooltip": true
                }
            }, {
                "mark": {
                    "type": "text",
                    "align": "left",
                    "baseline": "botton"
                },
                "encoding": {
                    "color": {"value": "black"},
                    "text": {"field": "LOCAL", "aggregate": "count", "type": "quantitative"}
                }
            }]
        };

    vegaEmbed('#vis1', barchart);

    let stackedbarchart = {
        title: 'Casos confirmados por município do Pará e forma de contaminação',
        width: "container",
        data: {
            values: para_covid
        },

        "encoding": {
            "color": {"field": "STATUS", "scale": {"scheme": "set2"}},
            "y": {"field": "LOCAL", "type": "ordinal", "sort": "ascending"},
            "x": {"field": "LOCAL", "aggregate": "count", "type": "quantitative"},
        },
        "config": {
            "countTitle": "QUANTIDADE DE CASO",
            "axisX": {"titleLimit": 150},
        },
        "layer": [{
            "mark": {
                "type": "bar",
                "tooltip": true
            }
        }, {
            "mark": {
                "type": "text",
                "align": "left",
                "baseline": "botton"
            },
            "encoding": {
                "color": {"value": "black"},
                "text": {"field": "LOCAL", "aggregate": "count", "type": "quantitative"},
            },

        }]
    };

    vegaEmbed('#vis2', stackedbarchart);


    let colors_genero = ["#0000ff","#ff0000"];

    //PIE CHART
    let piechart = {
        width:"container",
        height: "400",
        title: 'Genero dos casos confirmados',
        "description": "A simple pie chart with labels.",
        "data": {
            "values": para_covid
        },
        "encoding": {
            "theta": {"field": "GENERO", "aggregate": "count", "type": "ordinal", "stack": true},
            "color": {"field": "GENERO", "type": "nominal", "scale": {"scheme": "set2"}, "legend": null}
        },
        "layer": [{
            "mark": {
                "tooltip": true,
                "type": "arc", "outerRadius": 150}
        }, {
            "mark": {"type": "text", "radius": 160},
            "encoding": {
                "text": {"field": "GENERO", "type": "ordinal"}
            }
        }],
        "view": {"stroke": null}

    }

    let pieChart_data = faixa_etaria(para_covid.filter((d)=>d.IDADE));
    let chart_faixa_etaria = {
        width: "container",
        height:300,
        title: 'Faixa etária dos casos',
        data: {
            values: pieChart_data
        },
        "encoding": {
             "color": {"field": "IDADE", "scale": {"scheme": "set3"}},
            "y": {"field": "QTD", "type": "quantitative"},
            "x": {"field": "IDADE", "type": "nominal"},
        },
        "layer": [{
            "mark": {
                "type": "bar",
                "tooltip": true
            }
        }, {
            "mark": {
                "type": "text",
                "align": "left",
                "baseline": "botton"
            },
            // "encoding": {
            //     "color": {"value": "black"},
            //     "text": {"field": "QTD", "type": "quantitative"},
            // },

        }]
    }


    vegaEmbed('#vis3', piechart);
    vegaEmbed('#vis4', chart_faixa_etaria);


    let maxDate = 0;
    para_covid.map(d => {
        if (moment(d.DATA) > maxDate) {
            maxDate = moment(d.DATA);
        }
    });

    let date = document.getElementById("update_date");
    date.innerText = "Data de atualização:" + maxDate._i;


    let textcomfirm = document.createTextNode(para_covid.length);
    document.getElementById("number_comfirm").appendChild(textcomfirm);


    let textdeath = document.createTextNode(para_death_covid.length);
    document.getElementById("number_deaths").appendChild(textdeath);

}

function faixa_etaria(data) {
    let faixa_etaria_data = [];

    let count_idades = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    for (let i = 0; i < data.length; i++) {
        if (data[i].IDADE <= 9) {
            count_idades[0] = count_idades[0] += 1;
        } else if (data[i].IDADE <= 18) {
            count_idades[1] = count_idades[1] += 1;
        } else if (data[i].IDADE <= 29) {
            count_idades[2] = count_idades[2] += 1;
        } else if (data[i].IDADE <= 39) {
            count_idades[3] = count_idades[3] += 1;
        } else if (data[i].IDADE <= 49) {
            count_idades[4] = count_idades[4] += 1;
        } else if (data[i].IDADE <= 59) {
            count_idades[5] = count_idades[5] += 1;
        } else if (data[i].IDADE <= 69) {
            count_idades[6] = count_idades[6] += 1;
        } else if (data[i].IDADE <= 79) {
            count_idades[7] = count_idades[7] += 1;
        } else if (data[i].IDADE >= 80) {
            count_idades[8] = count_idades[8] += 1;
        }
    }

    let faixa_1 = {"IDADE": "entre 0 e 9 ", "QTD": count_idades[0]};
    let faixa_2 = {"IDADE": "entre 10 e 18 ", "QTD": count_idades[1]};
    let faixa_3 = {"IDADE": "entre 19 e 29 ", "QTD": count_idades[2]};
    let faixa_4 = {"IDADE": "entre 30 e 39 ", "QTD": count_idades[3]};
    let faixa_5 = {"IDADE": "entre 40 e 49 ", "QTD": count_idades[4]};
    let faixa_6 = {"IDADE": "entre 50 e 59 ", "QTD": count_idades[5]};
    let faixa_7 = {"IDADE": "entre 60 e 69 ", "QTD": count_idades[6]};
    let faixa_8 = {"IDADE": "entre 70 e 79 ", "QTD": count_idades[7]};
    let faixa_9 = {"IDADE": "maior que 80", "QTD": count_idades[8]};


    faixa_etaria_data.push(faixa_1, faixa_2, faixa_3, faixa_4, faixa_5, faixa_5, faixa_6, faixa_7, faixa_8, faixa_9);

    return faixa_etaria_data;
}

start();

