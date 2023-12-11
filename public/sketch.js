//Link archivo p5.js: https://editor.p5js.org/fresia/sketches/FnxYM0B0O

let socket;
let carac;

//Para guardar el dibujo colaborativo.
let canva;

//Load Image/Font.
let img;
let lap;
let font;

//Cuando uno pasa el mouse por los botones cambian de color.
//C/U tiene un fill distinto así son independientes.
let fillBoton1 = "#FBABD3";
let fillBoton2 = "#FBABD3";
let fillBoton3 = "#FBABD3";
let fillBoton4 = "#FBABD3";

//Color Stroke.
let strokeBoton = "#E935A2";

//Transparente para que primero se tenga que elegir un color.
let colores = "#FFFFFF00";

//Tamaño del stroke que hace de "pincel".
//Se puede aumentar o disminuir.
let pincel = 2;

//Contador para guardar el canvas.
let contador = 0;

function preload() {
  imgPNG = loadImage("img/mariposa-tpf.png");
  lapPNG = loadImage("img/lapices-tpf.png");
  font = loadFont("font/roboto-reg.ttf");
}

function setup() {
  canva = createCanvas(780, 760);

  background("#F375B9");

//Conexión con el servidor.
  socket = io.connect('http://localhost:3000/');

  socket.on('asignarCarac', (asignarCarac) => {
    carac = asignarCarac;
    console.log(asignarCarac);
  });

  //----------> Título.
  push();
  strokeWeight(3);
  stroke(strokeBoton);
  line(237, 53, 543, 53);
  pop();
  
  push();
  textAlign(CENTER);
  stroke(strokeBoton);
  strokeWeight(7);
  fill("#FBABD3");
  
  textSize(33);
  textFont(font);
  text("Juegos para colorear", width/2, 45);
  
  textFont("Arial");
  textSize(27);
  text("🎨", 215, 45);
  text("🎨", 570, 45);
  pop();

//----------> Todos los demás componentes guardados en una función.
//(Menos los botones).
  plantilla();

//Escucha.
  socket.on('mouse', nuevoDibujo);
}

function draw() {
  //print(mouseX, mouseY);

  //----------> BOTONES:
  //Guardar:
  fill(fillBoton1);
  botonesVarios(50, 700, 125);
  texto("GUARDAR", 67, 730);
  //Reset:
  fill(fillBoton2);
  botonesVarios(205, 700, 125);
  texto("RESET", 240, 730);
  // + Stroke:
  fill(fillBoton3);
  botonesVarios(525, 700, 45);
  texto("+", 542, 730);
  // - Stroke:
  fill(fillBoton4);
  botonesVarios(680, 700, 45);
  texto("-", 700, 730);

  //Representación gráfica del stroke.
  push();
  fill("#FBABD3");
  strokeWeight(3);
  stroke(strokeBoton);
  circle(625, 723, 50);
  pop();

  push();
  noStroke();
  fill(strokeBoton);
  circle(625, 723, pincel);
  pop();

  //Otras delimitaciones.
  //Corresponden al color.
  //Y al cambio de cursor.
  if (zonasLimite(15, 70, 745, 610)) {
    cursor(HAND);
  } else if (zonasLimite(230, 15, 320, 30)) {
    cursor(HAND);
  } else if (zonasLimite(50, 700, 125, 45)) {
    cursor(HAND);
    fillBoton1 = "#FFA382";
  } else if (zonasLimite(205, 700, 125, 45)) {
    cursor(HAND);
    fillBoton2 = "#FFA382";
  } else if (zonasLimite(525, 700, 45, 45)) {
    cursor(HAND);
    fillBoton3= "#FFA382";
  } else if (zonasLimite(680, 700, 45, 45)) {
    cursor(HAND);
    fillBoton4 = "#FFA382";
  } else {
    cursor(ARROW);
    fillBoton1 = "#FBABD3";
    fillBoton2 = "#FBABD3";
    fillBoton3 = "#FBABD3";
    fillBoton4 = "#FBABD3";
  }
}

//----------> Funciones varias:
// - Delimitar la zona para pintar
// - Botones
// - Elegir color
function zonasLimite(x, y, w, h) {
  if (mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h) {
    return true;
  } else {
    return false;
  }
}

function nuevoDibujo(data) {
        stroke(data.col);
        strokeWeight(data.str);
        line(data.x, data.y, data.px, data.py);
}

//Stroke que dibuja el lienzo.
function mouseDragged() {
  // Para que pinte únicamente en la zona blanca.
  if (zonasLimite(15, 70, 750, 410)) {
    let data = {
      col: carac.col,
      str: carac.str,
      x: mouseX,
      y: mouseY,
      px: pmouseX,
      py: pmouseY
  };
    stroke(carac.col);
    strokeWeight(carac.str);
    line(mouseX, mouseY, pmouseX, pmouseY);

    socket.emit('mouse', data);
  }
}

//Otras funcionalidades que dependen del mousePressed.
function mousePressed() {
    if (zonasLimite(50, 700, 125, 45)) {
        guardar();
        print("Botón GUARDAR.");
    } else if (zonasLimite(205, 700, 125, 45)) {
        reset();
        print("Botón RESET.");
    } else if (zonasLimite(525, 700, 45, 45)) {
        carac.str++;
        pincel++;
        print("Botón + aumentó a: " + pincel);
        if (carac.str >= 15) {
          carac.str--;
          pincel--;
        }
    } else if (zonasLimite(680, 700, 45, 45)) {
        carac.str--;
        pincel--;
        print("Botón - disminuyó a: " + pincel);
        if (carac.str <= 1) {
          carac.str++;
          pincel++;
        }
    }
  
  }
  
  ////Otras funcionalidades que dependen del mouseClicked.
  //Elección de los colores a usar.
  function mouseClicked() {
    // Delimita la zona de los lápices de colores.
    if (zonasLimite(15, 595, 30, 80)) {
      carac.col = "#FFEA00";
      print("Color: Amarillo.");
    } else if (zonasLimite(50, 595, 30, 80)) {
      print("Color: Amarillo Oscuro.");
      carac.col = "#FEC601";
    } else if (zonasLimite(80, 595, 30, 80)) {
      carac.col = "#FE9901";
      print("Color: Naranja.");
    } else if (zonasLimite(115, 595, 30, 80)) {
      carac.col = "#FB2702";
      print("Color: Rojo Claro.");
    } else if (zonasLimite(145, 595, 30, 80)) {
      carac.col = "#E2321A";
      print("Color: Rojo.");
    } else if (zonasLimite(180, 595, 30, 80)) {
      carac.col = "#C04043";
      print("Color: Rojo Oscuro.");
    } else if (zonasLimite(210, 595, 30, 80)) {
      carac.col = "#8C4F4E";
      print("Color: Marrón Rojizo.");
    } else if (zonasLimite(245, 595, 30, 80)) {
      carac.col = "#FdAE77";
      print("Color: Rosa Viejo.");
    } else if (zonasLimite(275, 595, 30, 80)) {
      carac.col = "#FF99C8";
      print("Color: Rosa.");
    } else if (zonasLimite(305, 595, 30, 80)) {
      carac.col = "#CE90C9";
      print("Color: Lila.");
    } else if (zonasLimite(340, 595, 30, 80)) {
      carac.col = "#6C4F85";
      print("Color: Violeta.");
    } else if (zonasLimite(370, 595, 30, 80)) {
      carac.col = "#71ADFB";
      print("Color: Celeste.");
    } else if (zonasLimite(405, 595, 30, 80)) {
      carac.col = "#7692F6";
      print("Color: Azul Claro.");
    } else if (zonasLimite(435, 595, 30, 80)) {
      carac.col = "#424CC7";
      print("Color: Azul.");
    } else if (zonasLimite(470, 595, 30, 80)) {
      carac.col = "#292F80";
      print("Color: Azul Oscuro.");
    } else if (zonasLimite(500, 595, 30, 80)) {
      carac.col = "#76C7C0";
      print("Color: Verde Agua.");
    } else if (zonasLimite(535, 595, 30, 80)) {
      carac.col = "#86E649";
      print("Color: Verde Claro.");
    } else if (zonasLimite(565, 595, 30, 80)) {
      carac.col = "#73C579";
      print("Color: Verde.");
    } else if (zonasLimite(600, 595, 30, 80)) {
      carac.col = "#548568";
      print("Color: Verde Oscuro.");
    } else if (zonasLimite(630, 595, 30, 80)) {
      carac.col = "#EE9146";
      print("Color: Marrón Claro.");
    } else if (zonasLimite(665, 595, 30, 80)) {
      carac.col = "#C1986C";
      print("Color: Marrón Verdozo.");
    } else if (zonasLimite(695, 595, 30, 80)) {
      carac.col = "#7A5E53";
      print("Color: Marrón Oscuro.");
    } else if (zonasLimite(730, 595, 30, 80)) {
      carac.col = "#545352";
      print("Color: Gris.");
    } else {
      carac.col = "#FFFFFF00";
      //Transparente otra vez.
      //Y, si se sueta el mouse.
      //Siempre hay que volver a elegir un color.
    }

  }

//Características comúnes a todos los botones.
function botonesVarios(x, y, w) {
  stroke(strokeBoton);
  strokeWeight(2.3);
  rect(x, y, w, 45, 3);
}

//Idem texto de c/u.
function texto(textoVarios, x, y) {
  textFont(font);
  stroke(strokeBoton);
  strokeWeight(0.5);
  fill(strokeBoton);
  textSize(20);
  text(textoVarios, x, y);
}

//----------> Lo que se ve en pantalla (menos los botones y el título).
function plantilla() {
  //Fondo blanco.
  push();
  noStroke();
  fill("#FFFFFF");
  rect(15, 75, 750, 600);
  pop();

  //Imágenes.
  push();
  image(imgPNG, 15, 85);
  image(lapPNG, 15, 515);
  pop();

  //"Marco":
  push();
  strokeWeight(5);
  stroke("#E935A2");
  noFill();
  rect(13, 72, 750, 610, 3);
  pop();
}

//----------> Funcionalidades de los botones.
function guardar() {
  contador++;
  saveCanvas(canva, "dibujo_colab" + contador, "jpg");
}

function reset() {
  plantilla();
}

document.oncontextmenu = function () {
  return false;
};


