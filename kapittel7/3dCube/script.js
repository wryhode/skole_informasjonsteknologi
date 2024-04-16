const canvas = document.getElementById("screen");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

let cameraX, cameraY, cameraZ;
let cameraRotX, cameraRotY, cameraRotZ;
let cameraVector = [0,0,0];
let cameraRotVector = [0,0,0];
let cameraVF = canvas.width / 2;;
let model = null;

async function loadModel(fileName) {
    let vertecies = new Array();
    let faces = new Array();

    let response = await fetch(fileName);
    let text = await response.text();
    let toParse = text.split("\n");
    for(let i = 0; i < toParse.length; i++){
        const element = toParse[i];
        if (element.startsWith("v ")){
            let coords = element.split(" ");
            vertecies.push(
                [Number(coords[1]), Number(coords[2]), Number(coords[3])]
            );
        }
        else if (element.startsWith("f ")){
            let f = element.split(" ");
            let f0 = f[1].split("/")[0];
            let f1 = f[2].split("/")[0];
            let f2 = f[3].split("/")[0];
            faces.push(
                [Number(f0)-1, Number(f1)-1, Number(f2)-1] // Subtract 1 for faster array indexing later (wow obj is old)
            );
        }
    };
    return {"vertecies":vertecies, "faces":faces};
}

function transformObject(vertecies, objectTranslation, objectRotation, objectScale, cameraPosition, cameraRotation) {
    let transformed = new Array();
    let x, y, z;
    let xRotAngle = objectRotation[0];
    let yRotAngle = objectRotation[1];
    let zRotAngle = objectRotation[2];
    
    for(let i = 0; i < vertecies.length; i++){
        const element = vertecies[i];
        x = (element[0] - objectTranslation[0]) * objectScale[0];
        y = (element[1] - objectTranslation[1]) * objectScale[1];
        z = (element[2] - objectTranslation[2]) * objectScale[2];
        
        x_rot = x*Math.cos(zRotAngle)-y*Math.sin(zRotAngle);
        y_rot = y*Math.cos(zRotAngle)+x*Math.sin(zRotAngle);

        //rotation about the y-axis
        lag = x_rot;
        x_rot = x_rot*Math.cos(yRotAngle)-z*Math.sin(yRotAngle);
        z_rot = z*Math.cos(yRotAngle)+lag*Math.sin(yRotAngle);

        //rotation about the x-axis
        lag = y_rot;
        y_rot = y_rot*Math.cos(xRotAngle)-z_rot*Math.sin(xRotAngle);
        z_rot = z_rot*Math.cos(xRotAngle)+lag*Math.sin(xRotAngle);

        transformed.push([x_rot, y_rot, z_rot]);

    };
    
    return transformed;
}

function drawObject(vertecies, faces) {
    for(let i = 0; i < faces.length; i++){ // Why the long face :)
        const face = faces[i];
        let v0 = vertecies[face[0]];
        let v1 = vertecies[face[1]];
        let v2 = vertecies[face[2]];

        sx0 = (v0[0] / v0[2]) * cameraVF;
        sy0 = (v0[1] / v0[2]) * cameraVF;
        
        sx1 = (v1[0] / v1[2]) * cameraVF;
        sy1 = (v1[1] / v1[2]) * cameraVF;
        
        sx2 = (v2[0] / v2[2]) * cameraVF;
        sy2 = (v2[1] / v2[2]) * cameraVF;

        mx = canvas.width / 2;
        my = canvas.height / 2;

        ctx.beginPath();
        ctx.moveTo(sx0 + mx, sy0 + my);
        ctx.lineTo(sx1 + mx, sy1 + my);
        ctx.lineTo(sx2 + mx, sy2 + my);
        ctx.stroke();
    }
}

function handleKeyPress(event){
    const key = event.key;

    if(key == "a"){
        cameraVector[0] = 1;
    }
    if(key == "d"){
        cameraVector[0] = -1;
    }
    if(key == "q"){
        cameraVector[1] = 1;
    }
    if(key == "e"){
        cameraVector[1] = -1;
    }
    if(key == "s"){
        cameraVector[2] = 1;
    }
    if(key == "w"){
        cameraVector[2] = -1;
    }
    
    if(key == "ArrowUp"){
        cameraRotVector[0] = -1;
    }
    if(key == "ArrowDown"){
        cameraRotVector[0] = 1;
    }
    if(key == "ArrowLeft"){
        cameraRotVector[1] = -1;
    }
    if(key == "ArrowRight"){
        cameraRotVector[1] = 1;
    }
}

function handleKeyUp(event){
    const key = event.key;

    if(key == "a"){
        cameraVector[0] = 0;
    }
    if(key == "d"){
        cameraVector[0] = 0;
    }
    if(key == "q"){
        cameraVector[1] = 0;
    }
    if(key == "e"){
        cameraVector[1] = 0;
    }
    if(key == "w"){
        cameraVector[2] = 0;
    }
    if(key == "s"){
        cameraVector[2] = 0;
    }

    if(key == "ArrowUp"){
        cameraRotVector[0] = 0;
    }
    if(key == "ArrowDown"){
        cameraRotVector[0] = 0;
    }
    if(key == "ArrowLeft"){
        cameraRotVector[1] = 0;
    }
    if(key == "ArrowRight"){
        cameraRotVector[1] = 0;
    }
}

document.addEventListener("keydown", handleKeyPress);
document.addEventListener("keyup", handleKeyUp);

function init(){
    model = loadModel("monke.obj").then((response) => {
        model = response;
        let t = 0;
        cameraX = 0;
        cameraY = 0;
        cameraZ = 10;
        cameraRotX = 0;
        cameraRotY = 0;
        cameraRotZ = 0;

        function main(){
            window.requestAnimationFrame(main);
            ctx.clearRect(0, 0, canvas.height, canvas.width);
            ctx.fillStyle = "#fff"
            ctx.fillRect(0,0, canvas.width, canvas.height);
            
            cameraX += cameraVector[0] * 0.1;
            cameraY += cameraVector[1]* 0.1;
            cameraZ += cameraVector[2]*0.1;
            
            cameraX = Math.sin(t/100) * 20;
            cameraZ = Math.cos(t/100) * 20;
            cameraRotY = t/100

            cameraRotX += cameraRotVector[0] * 0.01;
            cameraRotY += cameraRotVector[1] * 0.01;
            cameraRotZ += cameraRotVector[2] * 0.01;

            let a = 3+Math.sin(t/20)*2;
            let b = 3+Math.cos((t+0.5)/20)*2;
            let c = 3+Math.sin((t+1.4)/20)*2;
            let tverts = transformObject(model.vertecies, [0,0,0], [0,0,0], [a,b,c]);
            let vertecies = transformObject(tverts, [cameraX, cameraY, cameraZ], [cameraRotX, cameraRotY, cameraRotZ], [1,1,1]);
            drawObject(vertecies, model.faces);
            t ++;

        }
        main();
    });
}


init();