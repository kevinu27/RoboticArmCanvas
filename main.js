var angleOneConst =80
var angleTwoConst = 10
const lenghtOne = 250
const lenghtTwo = 250
const radioCircle = lenghtOne + lenghtTwo
var teta2Grados
var teta1Grados
var path = [{x:0, y:0}] 
var clickado = false
let pathCheckbox 
let motorSimulation = false
let framesCounter=0
let initialPosForSimulation = true
let prevFrameCounter
let xCoordinate 
let yCoordinate
let steps

document.getElementById("path").onclick = function() {checkingboxFunction()};
function checkingboxFunction() {
    pathCheckbox = document.getElementById('path').checked
  }
  document.getElementById("clean").onclick = function() {checkingboxFunction2()};
function checkingboxFunction2() {
    path = [{x:0, y:0}] 
  }

  document.getElementById("coordinatesButton").addEventListener("click", setCoordinates);

function setCoordinates() {
    xCoordinate =  document.getElementById("xCoordinate").value;
    yCoordinate = document.getElementById("yCoordinate").value;
    steps = document.getElementById("steps").value;

    console.log("xCoordinate: ", xCoordinate)
    console.log("yCoordinate: ", yCoordinate)
    console.log("steps: ", steps)
    motorSimulation = !motorSimulation 
    prevFrameCounter = framesCounter

}


const game = {
    canvasDom: undefined,
    ctx: undefined,
    canvasSize: { w: undefined, h: undefined },
    x:undefined,
    y: undefined,
    FPS: 10,
    counter: 0,
    lineOne:undefined,
    lineTwo:undefined,
    x: undefined, // x del raton
    y: undefined, // y del raton
    lengthOne: 100,  
    initialAngleOne: angleOneConst*(Math.PI / 180),
    initialXOne:  Math.cos(angleOneConst*(Math.PI / 180))*lenghtOne, 
    initialYOne: Math.sin(angleOneConst*(Math.PI / 180)) *lenghtOne,
    endXTwo:  Math.cos(angleTwoConst*(Math.PI / 180))*lenghtTwo + Math.cos(angleOneConst*(Math.PI / 180))*lenghtOne, 
    endYTwo: Math.sin(angleTwoConst*(Math.PI / 180)) *lenghtTwo + Math.sin(angleOneConst*(Math.PI / 180)) *lenghtOne,
    memberOne: { 
        origin: {x:0, y:0},
        end: {x:this.initialXOne, y:100}
    },
    memberTwo: { 
        length: 100,
        origin: { x: 100, y:100},
        end: {x:200, y:200},
    },

    init() {
        this.setContext()
        this.setDimensions()
        this.setEventListeners()
        this.start()
    },

    setContext() {
        this.canvasDOM = document.querySelector('#myCanvas')
        this.ctx = this.canvasDOM.getContext('2d')
        // this.ctx.setTransform(2, 0, 0, 2, this.canvasSize.w / 2, this.canvasSize.h / 2); // zooms in by 2 with origin at center
        // this.ctx.setTransform(0.5, 0, 0, 0.5, this.canvasSize.w / 2, this.canvasSize.h/ 2); // zooms out by 2 with origin at center
    },
    setDimensions() {
        this.canvasSize.w = window.innerWidth
        this.canvasSize.h = window.innerHeight
        // console.log('window.innerHeight', window.innerHeight)
        this.canvasDOM.setAttribute('width', this.canvasSize.w/2)
        this.canvasDOM.setAttribute('height', this.canvasSize.h)
        
    },

    setEventListeners() {
        const canvas = document.querySelector('canvas')
        canvas.addEventListener('mousemove', function(e) {
        getCursorPosition(canvas, e)
        })
        const that = this
        function getCursorPosition(canvas, event) {
            const rect = canvas.getBoundingClientRect()
            // that.x = event.clientX - rect.left
            // that.y = event.clientY - rect.top
            that.x =event.clientX - 8
            that.y = event.clientY - 8
        }
        canvas.addEventListener('mousedown', function(e) {
            getCursorClicked(canvas, e)
            })
            function getCursorClicked(canvas, event) {
             clickado = !clickado
            //  console.log("cliackdo:", clickado) 
            }
    },

    start(){
        this.createLine()
        
        setInterval(()=> {
            framesCounter > 50000 ? framesCounter = 0 : framesCounter++
            if(!motorSimulation){
                this.clearAll()
                this.calculation()
                this.drawAll()
        }
            if(motorSimulation){
                this.clearAll()
                this.calculationMotorSimulation()
                this.drawAllMotorSimulation()
        }

        }, 1000/this.FPS)
    },
    
    createLine(){
        this.lineOne = new Line(this.ctx, this.memberOne.origin.x,  this.memberOne.origin.y,   this.initialXOne , this.initialYOne )
        this.lineTwo = new Line(this.ctx, this.initialXOne , this.initialYOne, this.endXTwo,  this.endYTwo )
        this.lineThree = new Line(this.ctx,  this.memberOne.origin.x,  this.memberOne.origin.y,  this.endXTwo,  this.endYTwo, 'dashed' )
    },
    drawCircle(){
        this.ctx.beginPath();
        this.ctx.setLineDash([10,5]);
        //  this.ctx.lineWidth = 2; 
        this.ctx.strokeStyle = 'red'
        this.ctx.arc(0, 0, radioCircle, 0, 2 * Math.PI);
        this.ctx.stroke();
        this.ctx.setLineDash([0,0]);
        
    },
    clearAll(){
        this.ctx.clearRect(0,0, this.canvasSize.w, this.canvasSize.h)
    },
    drawAll(){
        this.lineOne.draw()
        this.lineTwo.draw()
        this.lineThree.draw()
        this.drawCircle()
        this.drawText( this.x,  this.y)
       
        //punto del raton
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, 5, 0, Math.PI*2);
        this.ctx.fillStyle = "#000000";
        this.ctx.fill();
        this.ctx.closePath();

        //path
        for(let i = 0; i<=path.length-1; i++){
        this.ctx.beginPath();
        this.ctx.arc(path[i].x, path[i].y, 5, 0, Math.PI*2);
        this.ctx.fillStyle = "#00ff00";
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.fillStyle = "#000000";
        }


    }, 

    drawText(x,y){
    this.ctx.strokeStyle = 'black'
    this.ctx.font = '30px serif';
    this.ctx.strokeText(`X ${x}`, 510, 30);
    this.ctx.fillText(`X ${x}`, 510, 30);
    this.ctx.strokeText(`Y ${y}`, 510, 60);
    this.ctx.fillText(`Y ${y}`, 510, 60);
    this.ctx.strokeText(`θ1 ${teta1Grados}º`, 510, 90);
    this.ctx.fillText(`θ1 ${teta1Grados}º`, 510, 90);
    this.ctx.strokeText(`θ2 ${teta2Grados}º`, 510, 120);
    this.ctx.fillText(`θ2 ${teta2Grados}º`, 510, 120);
    // this.ctx.strokeText(`θ2: ${teta2Grados}º`,  this.lineOne.endX,  this.lineOne.endY);
    // this.ctx.fillText(`θ2: ${teta2Grados}º`,  this.lineOne.endX,  this.lineOne.endY);
    },

    calculation(){
        // console.log("calculo")
        // teorema del coseno
        // (lenghtOne*lenghtOne) + (lenghtTwo*lenghtTwo) - 2*lenghtOne*lenghtTwo*Math.cos(Beta) = this.x + this.y
        const beta= Math.acos(((lenghtOne*lenghtOne) + (lenghtTwo*lenghtTwo) - (this.x*this.x) - (this.y*this.y))/(2*lenghtOne*lenghtTwo))
        const betaGrado =beta*180/Math.PI
        // console.log("beta grados", betaGrado)

        const alfa =Math.acos(((this.x*this.x) + (this.y*this.y) + (lenghtOne*lenghtOne) - (lenghtTwo*lenghtTwo)) / (2*lenghtOne*(Math.sqrt(((this.x*this.x) + (this.y*this.y)))) ) )
        // const alfaGrado = alfa*180/Math.PI
        // console.log("alfa", alfaGrado)

        const lambda = Math.atan(this.y/this.x)
        // const lambdaGrados = lambda*180/Math.PI
        // console.log("lambdaGrados", lambdaGrados)
        const teta1= lambda - alfa
         teta1Grados = parseInt(teta1*180/Math.PI)
        // console.log("teta1Grados", teta1Grados)
        const teta2 = Math.PI - beta
         teta2Grados = parseInt(teta2*180/Math.PI)
        angleOneConst =teta1Grados
        angleTwoConst =teta2Grados + teta1Grados
        // console.log("teta2Grados", teta2Grados)
        this.initialXOne=  Math.cos(angleOneConst*(Math.PI / 180))*lenghtOne
        this.initialYOne= Math.sin(angleOneConst*(Math.PI / 180)) *lenghtOne
        this.endXTwo=  Math.cos(angleTwoConst*(Math.PI / 180))*lenghtTwo + Math.cos(angleOneConst*(Math.PI / 180))*lenghtOne
        this.endYTwo= Math.sin(angleTwoConst*(Math.PI / 180)) *lenghtTwo + Math.sin(angleOneConst*(Math.PI / 180)) *lenghtOne

//----------
        this.lineOne.endX =Math.cos(angleOneConst*(Math.PI / 180))*lenghtOne
        this.lineOne.endY =Math.sin(angleOneConst*(Math.PI / 180)) *lenghtOne

        this.lineTwo.originX = Math.cos(angleOneConst*(Math.PI / 180))*lenghtOne
        this.lineTwo.originY = Math.sin(angleOneConst*(Math.PI / 180)) *lenghtOne

        this.lineTwo.endX = Math.cos(angleTwoConst*(Math.PI / 180))*lenghtTwo + Math.cos(angleOneConst*(Math.PI / 180))*lenghtOne
        this.lineTwo.endY = Math.sin(angleTwoConst*(Math.PI / 180)) *lenghtTwo + Math.sin(angleOneConst*(Math.PI / 180)) *lenghtOne
       
        if(this.lineTwo.endX != path[path.length-1].x && clickado=== false && pathCheckbox){
        path.push({x:this.lineTwo.endX , y:this.lineTwo.endY})
        // console.log("path", path)
        }
        

        this.lineThree.endX= Math.cos(angleTwoConst*(Math.PI / 180))*lenghtTwo + Math.cos(angleOneConst*(Math.PI / 180))*lenghtOne
        this.lineThree.endY= Math.sin(angleTwoConst*(Math.PI / 180)) *lenghtTwo + Math.sin(angleOneConst*(Math.PI / 180)) *lenghtOne
//-------------------       
    },
    calculationMotorSimulation(){
        if(initialPosForSimulation){
        this.lineOne.originX = 0  
        this.lineOne.originY = 0
        this.lineOne.endX = 226
        this.lineOne.endY = 105 
        this.lineOne.draw()
        this.lineTwo.originX = 226  
        this.lineTwo.originY = 105
        this.lineTwo.endX = 1
        this.lineTwo.endY = 220
        this.lineTwo.draw()
        initialPosForSimulation = false
        setTimeout(function() {
          }, 3000);
    }else{
        const beta= Math.acos(((lenghtOne*lenghtOne) + (lenghtTwo*lenghtTwo) - (xCoordinate*xCoordinate) - (yCoordinate*yCoordinate))/(2*lenghtOne*lenghtTwo))
        const betaGrado =beta*180/Math.PI

        const alfa =Math.acos(((xCoordinate*xCoordinate) + (yCoordinate*yCoordinate) + (lenghtOne*lenghtOne) - (lenghtTwo*lenghtTwo)) / (2*lenghtOne*(Math.sqrt(((xCoordinate*xCoordinate) + (yCoordinate*yCoordinate)))) ) )

        const lambda = Math.atan(yCoordinate/xCoordinate)
        const teta1= lambda - alfa
         teta1Grados = parseInt(teta1*180/Math.PI)
        const teta2 = Math.PI - beta
         teta2Grados = parseInt(teta2*180/Math.PI)
        angleOneConst =teta1Grados
        angleTwoConst =teta2Grados + teta1Grados
        this.initialXOne=  Math.cos(angleOneConst*(Math.PI / 180))*lenghtOne
        this.initialYOne= Math.sin(angleOneConst*(Math.PI / 180)) *lenghtOne
        this.endXTwo=  Math.cos(angleTwoConst*(Math.PI / 180))*lenghtTwo + Math.cos(angleOneConst*(Math.PI / 180))*lenghtOne
        this.endYTwo= Math.sin(angleTwoConst*(Math.PI / 180)) *lenghtTwo + Math.sin(angleOneConst*(Math.PI / 180)) *lenghtOne
//----------
        this.lineOne.endX =Math.cos(angleOneConst*(Math.PI / 180))*lenghtOne
        this.lineOne.endY =Math.sin(angleOneConst*(Math.PI / 180)) *lenghtOne

        this.lineTwo.originX = Math.cos(angleOneConst*(Math.PI / 180))*lenghtOne
        this.lineTwo.originY = Math.sin(angleOneConst*(Math.PI / 180)) *lenghtOne

        this.lineTwo.endX = Math.cos(angleTwoConst*(Math.PI / 180))*lenghtTwo + Math.cos(angleOneConst*(Math.PI / 180))*lenghtOne
        this.lineTwo.endY = Math.sin(angleTwoConst*(Math.PI / 180)) *lenghtTwo + Math.sin(angleOneConst*(Math.PI / 180)) *lenghtOne
       
        // if(this.lineTwo.endX != path[path.length-1].x && clickado=== false && pathCheckbox){
        // path.push({x:this.lineTwo.endX , y:this.lineTwo.endY})
        // // console.log("path", path)
        // }
        

        this.lineThree.endX= Math.cos(angleTwoConst*(Math.PI / 180))*lenghtTwo + Math.cos(angleOneConst*(Math.PI / 180))*lenghtOne
        this.lineThree.endY= Math.sin(angleTwoConst*(Math.PI / 180)) *lenghtTwo + Math.sin(angleOneConst*(Math.PI / 180)) *lenghtOne
    }
    },
    drawAllMotorSimulation(){
        this.drawCircle()
        this.drawText( this.x,  this.y)
        this.lineOne.draw()
        this.lineTwo.draw()

    }
}