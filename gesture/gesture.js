export function enableGesture(element) {
  let contexts = Object.create(null);
  let MOUSE_SYMBOL = Symbol("mouse");
  if (document.body.ontouchstart !== null) {
    element.addEventListener("mousedown", (e) => {
      contexts[MOUSE_SYMBOL] = Object.create(null);
      start(e, contexts[MOUSE_SYMBOL]);

      let mousemove = (e) => {
        move(e, contexts[MOUSE_SYMBOL]);
      };

      let mouseend = (e) => {
        end(e, contexts[MOUSE_SYMBOL]);

        document.removeEventListener("mousemove", mousemove);
        document.removeEventListener("mouseup", mouseend);
      };

      document.addEventListener("mousemove", mousemove);
      document.addEventListener("mouseup", mouseend);
    });
  }

  element.addEventListener("touchstart", (e) => {
    for (const touch of event.changedTouches) {
      contexts[touch.identifier] = Object.create(null);
      start(touch, contexts[touch.identifier]);
    }
  });

  element.addEventListener("touchmove", (e) => {
    for (const touch of event.changedTouches) {
      move(touch, contexts[touch.identifier]);
    }
  });

  element.addEventListener("touchend", (e) => {
    for (const touch of event.changedTouches) {
      end(touch, contexts[touch.identifier]);
      delete contexts[touch.identifier];
    }
  });

  element.addEventListener("touchcancel", (e) => {
    for (const touch of event.changedTouches) {
      cancel(touch, contexts[touch.identifier]);
      delete contexts[touch.identifier];
    }
  });

  let start = (point, ctx) => {
    ctx.startX = point.clientX;
    ctx.startY = point.clientY;
    ctx.moves = [];
    ctx.isTap = true;
    ctx.isPan = false;
    ctx.isPress = false;

    element.dispatchEvent(
      new CustomEvent("start", {
        detail: {
          startX: ctx.startX,
          startY: ctx.startY,
          clientX: point.clientX,
          clientY: point.clientY,
        },
      })
    );

    ctx.timeoutHandler = setTimeout(() => {
      if (ctx.isPan) return;

      ctx.isTap = false;
      ctx.isPan = false;
      ctx.isPress = true;

      element.dispatchEvent(new CustomEvent("pressstart"));
    }, 500);
  };

  let move = (point, ctx) => {
    let dx = point.clientX - ctx.startX;
    let dy = point.clientY - ctx.startY;

    ctx.moves.push({
      dx,
      dy,
      t: Date.now(),
    });

    if (dx ** 2 + dy ** 2 > 100 && !ctx.isPan) {
      ctx.isPress && element.dispatchEvent(new CustomEvent("presscancel"));

      ctx.isTap = false;
      ctx.isPan = true;
      ctx.isPress = false;

      element.dispatchEvent(
        new CustomEvent("panstart", {
          detail: {
            startX: ctx.startX,
            startY: ctx.startY,
            clientX: point.clientX,
            clientY: point.clientY,
          },
        })
      );
    }

    if (ctx.isPan) {
      ctx.moves = ctx.moves.filter((record) => Date.now() - record.t < 300);
      element.dispatchEvent(
        new CustomEvent("pan", {
          detail: {
            startX: ctx.startX,
            startY: ctx.startY,
            clientX: point.clientX,
            clientY: point.clientY,
          },
        })
      );
    }
  };

  let end = (point, ctx) => {
    if (ctx.isPan) {
      let dx = point.clientX - ctx.startX;
      let dy = point.clientY - ctx.startY;
      let record = ctx.moves[0];
      let speed =
        Math.sqrt((record.dx - dx) ** 2 + (record.dy - dy) ** 2) /
        (Date.now() - record.t);
      let isFlick = speed > 2.5;

      if (isFlick) {
        element.dispatchEvent(
          new CustomEvent("flick", {
            detail: {
              startX: ctx.startX,
              startY: ctx.startY,
              clientX: point.clientX,
              clientY: point.clientY,
              speed,
              isFlick,
            },
          })
        );
      }
      element.dispatchEvent(
        new CustomEvent("panend", {
          detail: {
            startX: ctx.startX,
            startY: ctx.startY,
            clientX: point.clientX,
            clientY: point.clientY,
            speed,
            isFlick,
          },
        })
      );
    }
    if (ctx.isTap) {
      element.dispatchEvent(new CustomEvent("tap"));
    }
    if (ctx.isPress) {
      element.dispatchEvent(new CustomEvent("pressend"));
    }

    clearTimeout(ctx.timeoutHandler);
  };

  let cancel = (point, ctx) => {
    clearTimeout(ctx.timeoutHandler);
    element.dispatchEvent(new CustomEvent("cancel"));
  };
}
