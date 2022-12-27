class Line{
    constructor(ctx, originX, originY, endX, endY, type){
        this.ctx = ctx
        this.originX=originX
        this.originY=originY
        this.endX=endX
        this.endY=endY
        this.type = type
        this.init()
    }

        init(){
    //    console.log('iniciada')
    //    console.log('this.ballPos', this.ballPos)
        }

        draw(){
            // const angleRad = Math.atan2( this.playerPos.y - this.bulletLinesEndY, this.bulletLinesEndX - this.playerPos.x) 
            // this.ctx.beginPath();
            // if(tilted === true){
            //     // console.log("entro en el tilted === true")
            //     this.ctx.rotate(angleRad)
            // }
            // // this.ctx.rotate(45*180/Math.PI)

            // this.ctx.fillStyle = "#FF0000";
            // this.ctx.fillRect(this.playerPos.x, this.playerPos.y, this.playerSize.w, this.playerSize.h)
            // this.ctx.stroke();
           
          
            this.ctx.beginPath(); // Start a new path
            this.ctx.strokeStyle = '#ff0000';
            if(this.type === 'dashed'){
                this.ctx.strokeStyle = '#0000ff';
                this.ctx.setLineDash([10,5]);
                this.ctx.lineWidth = 1; 
                }
                else{
                    this.ctx.lineWidth = 5;
                }
                this.ctx.moveTo( this.originX, this.originY); // Move the pen to (30, 50)
                this.ctx.lineTo(this.endX,  this.endY); // Draw a line to (150, 100)
                // this.ctx.lineTo(deltaX+10, deltaY+10); // Draw a line to (150, 100)
                this.ctx.stroke(); // Render the path
                this.ctx.setLineDash([0,0]);
                this.ctx.lineWidth = 1; 
                

            
        }
  


}