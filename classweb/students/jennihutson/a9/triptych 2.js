

class TriptychMask {
	constructor() {

        // this.color0 = p5.color(p.fill(45, 75, 85, .8))
        let ringPoints = []
		let count = 40
		for (var i = 0; i < count; i++) {
			let theta  = i*Math.PI*2/count
			ringPoints.push(Vector.polar(200 + (i%2)*20, theta))
			ringPoints.push(Vector.polar(300 + (i%2)*20, theta))
			ringPoints.push(Vector.polar(400 + (i%2)*20, theta))
		}
        this.voronoiPoints = face.sides[0].faceRings[0].concat(face.sides[1].faceRings[0]).concat(ringPoints).concat(hand[0].points).concat(hand[1].points)
	
	}

	draw(p) {
        p.background(100, 100, 100)
        p.angleMode(p.DEGREES);    

        this.drawBackground(p);

        let c0 = p.color(45, 75, 85, .8)
        let c1 = p.color(116, 25, 85, .8)
        let c2 = p.color(338, 27, 85, .8)
			
        // Both face sides
        p.push();
        p.translate(70, 0)
        this.drawFace(p, c2);
        this.drawMouth(p)
        p.pop();

        p.push();
        p.translate(-70, 0)
		this.drawFace(p, c1);
        this.drawMouth(p)
        p.pop();

        this.drawFace(p, c0);
        this.drawMouth(p)

	}

    drawBackground(p){
        let apct = SLIDER.background

        let ringPoints = []
        let faceOutline = face.sides[0].faceRings[0].concat(face.sides[1].faceRings[0].slice().reverse())
        let ring0 = []
        let ring1 = []
        let ring2 = []

        let circles0 = []
        let circles1 = []
        let circles2 = []
		let count = 38
		for (var i = 0; i < count; i++) {
			let theta  = i*Math.PI*2/count
			ringPoints.push(Vector.polar(200 + (i%2)*20, theta))
            circles0.push(Vector.polar(200 + (i%2)*20, theta))
			ringPoints.push(Vector.polar(300 + (i%2)*20, theta))
            circles1.push(Vector.polar(300 + (i%2)*20, theta))
			ringPoints.push(Vector.polar(400 + (i%2)*20, theta))
            circles2.push(Vector.polar(400 + (i%2)*20, theta))
		}

        let hand1 = hand[0].points
        let hand2 = hand[1].points

        faceOutline.forEach(pt => {
            let new_pt = pt.coords.slice()
            new_pt[0] = new_pt[0] * 1.5
            new_pt[1] = new_pt[1] * 1.5
            let my_pt = new Vector()
            my_pt.coords = new_pt
            ring0.push(my_pt)
            
            new_pt = pt.coords.slice()
            new_pt[0] = new_pt[0] * 3
            new_pt[1] = new_pt[1] * 3
            my_pt = new Vector()
            my_pt.coords = new_pt
            ring1.push(my_pt)

            new_pt = pt.coords.slice()
            new_pt[0] = new_pt[0] * 4.5
            new_pt[1] = new_pt[1] * 4.5
            my_pt = new Vector()
            my_pt.coords = new_pt
            ring2.push(my_pt)
        })

        p.push()
        p.translate(40, 0)
        p.pop()
        p.push()
        p.translate(100,0)
        p.pop()
        
        for (let i=0; i<38; i++){
            p.strokeWeight(50)
            p.stroke(i/38 *360, 50, (70*apct)+20, .2)
            p.line(...faceOutline[i].coords, ...circles0[i].coords)
            p.line(...faceOutline[i].coords, ...circles1[i].coords)
            p.line(...faceOutline[i].coords, ...circles2[i].coords)
        }

        let twohands = hand1.concat(hand2)
        let circles00 = []
        let circles10 = []
        let circles20 = []
		let count0 = 44
		for (var i = 0; i < count0; i++) {
			let theta  = i*Math.PI*2/count
			ringPoints.push(Vector.polar(200 + (i%2)*20, theta))
            circles00.push(Vector.polar(200 + (i%2)*20, theta))
			ringPoints.push(Vector.polar(300 + (i%2)*20, theta))
            circles10.push(Vector.polar(300 + (i%2)*20, theta))
			ringPoints.push(Vector.polar(400 + (i%2)*20, theta))
            circles20.push(Vector.polar(400 + (i%2)*20, theta))
		}
        p.strokeWeight(3)
        for (let i=0; i<44; i++){
            p.stroke((44-i)/44 *360, 60, 90)
            p.line(...twohands[i].coords, ...circles00[i].coords)
            p.line(...twohands[i].coords, ...circles10[i].coords)
            p.line(...twohands[i].coords, ...circles20[i].coords)
        }


        // Convert to a simpler array of vectors 
		let pts = this.voronoiPoints.map(p => p.coords)

		// Create the diagram
		const delaunay = Delaunator.from(pts);

        p.noStroke()

        p.fill(0, 0, 100, .6)
        for (let i =0; i < hand1.length; i++){
            p.circle(...hand1[i].coords, 20)
        }
        for (let i =0; i < hand2.length; i++){
            p.circle(...hand2[i].coords, 20)
        }
    }

    drawFace(p, c0){
        let bpct = SLIDER.eyeliner
        // bpct = (bpct + .1) * 1.5

        let cpct = SLIDER.eyeshadow

        face.sideOrder.forEach(side => {
			// p.stroke(0)
            p.noStroke()
            // p.fill(45, 75, 85, .8)
            p.fill(c0)
            // p.fill(45, 70, 90)

            let outlinePoints = side.faceRings[0];
            // for (let i=0; i<outlinePoints.length; i++){
            //     outlinePoints[i].mult(bpct)
            // }
			drawContour(p, outlinePoints)
            drawContour(p, face.centerLine)

			// p.noFill()
            p.fill(100,100,100)
            // p.stroke(0)

			drawContour(p, side.eyeRings[2])
            p.stroke(0)
            p.fill(10, 100, 10)
			side.eye.draw(p, 10)

            p.stroke(210, 70, 80)
            p.strokeWeight(3)
            p.noFill()
            let waterline = side.eyeRings[2].slice(8, 16)
            drawContour(p, waterline);

            p.push()
            p.translate(0, 3)
            // p.stroke(210, 70, 80, .5)
            p.stroke(bpct*360, 70, 80, .5)
            p.strokeWeight(6)
            p.noFill()
            drawContour(p, waterline);
            p.pop()

            p.noFill()
            p.stroke(0)
            p.strokeWeight(2)
            let lowerLash = side.eyeRings[1].slice(8, 16)
            for (var i =0; i< 8; i++){
                p.line(...waterline[i].coords, ...lowerLash[i].coords);
            }


            let eyeliner = side.eyeRings[2].slice(0, 9)
            let eyeshadow = side.eyeRings[0].slice(0, 9).reverse()
            p.noStroke()
            // p.fill(15, 100, 35, .5)
            p.fill(cpct*360, 100, 35, .5)
            p.beginShape()
            eyeliner.forEach((pt) => {
                pt.curveVertex(p)
            })
            eyeshadow.forEach((pt) => {
                pt.curveVertex(p)
            })
            p.endShape()

            let eyebrows = eyeshadow.reverse()
            eyebrows = eyebrows.slice(2, 7)
            p.stroke(0)
            p.noFill()
            p.strokeWeight(3)
            p.push()
            p.translate(0, -7)
            drawContour(p, eyebrows)
            p.pop()

		})
        p.noFill()
        let nosept = face.centerLine[10].coords
        let noseContour = []
        noseContour.push([nosept[0]-5, nosept[1]-5])
        noseContour.push([nosept[0]-3, nosept[1]-2])
        noseContour.push(nosept)
        noseContour.push([nosept[0]+3, nosept[1]-2])
        noseContour.push([nosept[0]+5, nosept[1]-5])
        p.stroke(10,70, 20)
        p.beginShape()
        noseContour.forEach((pt) => {
            p.curveVertex(...pt)
        })
        p.endShape()
    }

    drawMouth(p){
        let toplip = face.mouth[4].slice(2, 8).concat(face.mouth[2].slice(3, 7).reverse())
        let bottomlip = face.mouth[4].slice(12, 18).concat(face.mouth[2].slice(13, 17).reverse())

        let lippct = SLIDER.lipstick;
        p.noStroke()
        p.fill(lippct*360,85, 40)
        p.beginShape()
        toplip.forEach(pt => {
            pt.curveVertex(p)
        })
        p.endShape()
        p.beginShape()
        bottomlip.forEach(pt => {
            pt.curveVertex(p)
        })
        p.endShape()
    }

	update(t, dt, frameCount) {

	}
}


masks.triptychMask = TriptychMask