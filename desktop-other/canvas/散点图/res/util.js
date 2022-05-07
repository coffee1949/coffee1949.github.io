// 画线的方法
function drawLine(x, y, X, Y) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(X, Y);
  ctx.stroke();
  ctx.closePath();
}

// 绘制矩形
// x,y坐标
// X,Y宽高
// mouseMove,
// color
function drawRect(x, y, X, Y, mouseMove, color, ifBigBar, ifDrag) {
  ctx.beginPath();

  if (parseInt(x) % 2 !== 0) {
    x += 1;
  }
  if (parseInt(y) % 2 !== 0) {
    y += 1;
  }
  if (parseInt(X) % 2 !== 0) {
    X += 1;
  }
  if (parseInt(Y) % 2 !== 0) {
    Y += 1;
  }
  ctx.rect(parseInt(x), parseInt(y), parseInt(X), parseInt(Y));

  if (
    ifBigBar &&
    mouseMove &&
    ctx.isPointInPath(mousePosition.x * 2, mousePosition.y * 2)
  ) {
    //如果是鼠标移动的到柱状图上，重新绘制图表
    ctx.strokeStyle = color;
    ctx.strokeWidth = 20;
    ctx.stroke();
  }
  //如果移动到拖动选择范围按钮
  canvas.style.cursor = "default";
  if (ifDrag && ctx.isPointInPath(mousePosition.x * 2, mousePosition.y * 2)) {
    //如果是鼠标移动的到柱状图上，重新绘制图表
    canvas.style.cursor = "all-scroll";
  }
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
}
