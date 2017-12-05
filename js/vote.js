Chart.defaults.global.defaultFontSize = 20;
Chart.defaults.global.defaultFontColor = "#000000";

const makeChart=id=>{
    const chart=document.querySelector(`#${id} canvas`)
    const labels=Array
        .from(document.querySelectorAll(`#${id} .values div div span:nth-child(1)`))
        .map(({innerText})=>innerText.slice(0,innerText.length-1))
    const valuesDom=document.querySelectorAll(`#${id} .values div div span:nth-child(2)`)
    const buttons=document.querySelectorAll(`#${id} .values button`)
    const yes=buttons[0]
    const no=buttons[1]
    let ctx = chart.getContext('2d')
    let mChart = new Chart(ctx, {
        type: "horizontalBar",
        data: {
            labels,
            datasets: [
                {
                    label: "data",
                    fill: false,
                    backgroundColor: ["rgba(255, 99, 132, 0.2)","rgba(54, 162, 235, 0.2)"],
                    borderColor: ["rgb(255, 99, 132)",'rgb(54, 162, 235)'],
                    data: [0,0],
                    borderWidth: 1
                }
            ]
        },
        options: {
            legend:{
                display:false
            },
            tooltips: {
                enabled:false
            },
            scales: {
                xAxes: [{
                    ticks: {
                        beginAtZero: true,
                        stepSize:1,
                        maxTicksLimit:15,
                        maxRotation:0
                    }
                }]
            }
        }
    })

    let ref=defaultDatabase.ref().child(id)
    ref.on('value',data=>{
        let {yes,no}=data.val()
        mChart.data.datasets[0].data[0]=yes
        mChart.data.datasets[0].data[1]=no
        mChart.update()
        valuesDom[0].innerHTML=yes
        valuesDom[1].innerHTML=no
    })

    const vote=(option)=>{
        lastState=sessionStorage[id]
        lastState=lastState==undefined?undefined:lastState=="true"?true:false
        sessionStorage[id]=option
        buttonState()
        console.log(lastState)
        console.log(option)
        console.log(lastState!=option)
        if(option){
            ref.transaction((post)=> {
                if(lastState!=undefined&&lastState!=option){
                    no.disabled=false
                    post.no-=1
                }
                post.yes+=1
                return post
            })
        }
        else{
            ref.transaction((post)=> {
                if(lastState!=undefined&&lastState!=option){
                    post.yes-=1
                }
                post.no+=1
                return post
            })
        }
    }

    const buttonState=()=>{
        yes.disabled=true;
        no.disabled=true;
        if(sessionStorage[id]==undefined){
            yes.disabled=false;
            no.disabled=false;
        }
        else if(sessionStorage[id]=="true"){
            no.disabled=false;
        }
        else{
            yes.disabled=false;
        }
    }

    buttonState()
    yes.onclick=vote.bind(null,true)
    no.onclick=vote.bind(null,false)
}