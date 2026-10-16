(function () {
  const container = document.querySelector(".uikit-wave");
  if (!container) return;

  const canvas = container.querySelector(".uikit-wave__canvas");
  if (!canvas) return;

  const gl = canvas.getContext("webgl", {
    alpha: true,
    premultipliedAlpha: false,
    antialias: false,
    powerPreference: "low-power",
  });

  if (!gl) return;

  // Vertex shader
  const vertexShaderSource = `
    attribute vec2 a_pos;

    void main() {
      gl_Position = vec4(a_pos, 0.0, 1.0);
    }
  `;

  // Fragment shader
  const fragmentShaderSource = `
precision highp float;

uniform vec2 u_res;
uniform float u_time;

// Мягкий луч с постоянно меняющейся формой
float ray(
  vec2 p,
  vec2 origin,
  float angle,
  float width,
  float length,
  float seed
) {
  vec2 axis = vec2(cos(angle), sin(angle));
  vec2 d = p - origin;

  float along = dot(d, axis);
  float side = dot(d, vec2(-axis.y, axis.x));

  // Изгибы луча
  side += 0.075 * sin(
    along * 5.0 + u_time * 0.46 + seed
  );

  side += 0.04 * sin(
    along * 10.0 - u_time * 0.27 + seed * 2.3
  );

  // Плавное изменение ширины
  float w = width * (
    1.0 + 0.2 * sin(
      along * 3.0 - u_time * 0.3 + seed
    )
  );

  // Размытые края
  float core = exp(
    -1.2 * pow(side / max(w, 0.03), 2.0)
  );

  // Растворение концов луча
  float fade =
    smoothstep(-length * 0.65, -length * 0.22, along)
    * (1.0 - smoothstep(
        length * 0.25, length, along
      ));

  return core * fade;
}

void main() {
  float t = u_time;

  vec2 uv = (
    gl_FragCoord.xy - 0.5 * u_res
  ) / u_res.y;

  // Независимые движущиеся лучи
  float a = ray(
    uv,
    vec2(-0.39 + 0.12 * sin(t * 0.22),
         -0.09 + 0.11 * cos(t * 0.17)),
    0.28 + 0.22 * sin(t * 0.19),
    0.26, 1.4, 0.8
  );

  float b = ray(
    uv,
    vec2(0.19 + 0.10 * cos(t * 0.16),
         0.20 + 0.08 * sin(t * 0.23)),
    -0.65 + 0.30 * cos(t * 0.14),
    0.23, 1.3, 1.7
  );

  float c = ray(
    uv,
    vec2(-0.10 + 0.16 * sin(t * 0.13), -0.27),
    1.13 + 0.22 * sin(t * 0.21),
    0.25, 1.3, 2.9
  );

  float d = ray(
    uv,
    vec2(0.32 + 0.09 * cos(t * 0.2),
         -0.11 + 0.10 * sin(t * 0.18)),
    2.65 + 0.22 * cos(t * 0.16),
    0.23, 1.2, 4.2
  );

  float strength =
    a * 0.85 + b * 0.8 +
    c * 0.7 + d * 0.7;

  // -----------------------------------
  // ЦВЕТА ИЗ ТВОЕГО ГРАДИЕНТА
  // -----------------------------------

  // Основные цвета четырёх лучей
  vec3 color = (
    a * 0.85 * vec3(26.0, 108.0, 255.0) +
    b * 0.8  * vec3(87.0, 196.0, 255.0) +
    c * 0.7  * vec3(61.0, 139.0, 255.0) +
    d * 0.7  * vec3(111.0, 210.0, 255.0)
  ) / (max(strength, 0.001) * 255.0);

  // #7dc4ff — мягкий голубой переход
  color = mix(
    color,
    vec3(125.0, 196.0, 255.0) / 255.0,
    smoothstep(0.35, 1.6, strength) * 0.25
  );

  // #9fd8ff — осветление
  color = mix(
    color,
    vec3(159.0, 216.0, 255.0) / 255.0,
    smoothstep(0.55, 1.4, strength) * 0.45
  );

  // #cdeaff — светло-голубой
  color = mix(
    color,
    vec3(205.0, 234.0, 255.0) / 255.0,
    smoothstep(0.9, 1.75, strength) * 0.6
  );

  // #ffffff — мягкие белые участки
  // в местах максимальной интенсивности
  color = mix(
    color,
    vec3(1.0, 1.0, 1.0),
    smoothstep(1.45, 2.4, strength) * 0.65
  );

  // -----------------------------------
  // ПРОЗРАЧНОСТЬ
  // -----------------------------------

  // Прозрачность за пределами лучей
  float alpha = smoothstep(
  0.18,
  0.95,
  strength
) * 0.80;

float whiteIntensity = smoothstep(
    1.0,
    1.8,
    strength
    );

    alpha *= 1.0 - whiteIntensity * 0.15;

    // Полностью убираем пиксели за пределами лучей
    if (alpha < 0.005) {
    discard;
    }
    gl_FragColor = vec4(color, alpha);
    }
`;

  // Компиляция шейдеров
  function createShader(type, source) {
    const shader = gl.createShader(type);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);

  const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

  if (!vertexShader || !fragmentShader) return;

  // Создание программы
  const program = gl.createProgram();

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
    return;
  }

  gl.useProgram(program);

  // Геометрия на весь экран
  const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);

  const buffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const position = gl.getAttribLocation(program, "a_pos");

  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const resolution = gl.getUniformLocation(program, "u_res");

  const time = gl.getUniformLocation(program, "u_time");

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const start = performance.now();
  let animationId;
  let visible = true;

  // Анимация
  function render(now) {
    if (!visible || !container.isConnected) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.35);

    const width = Math.round(canvas.clientWidth * dpr);

    const height = Math.round(canvas.clientHeight * dpr);

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    }

    gl.uniform2f(resolution, width, height);

    gl.uniform1f(time, reducedMotion ? 3 : (now - start) * 0.001);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    if (!reducedMotion) {
      animationId = requestAnimationFrame(render);
    }
  }

  // Останавливаем анимацию вне экрана
  const observer = new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;

    cancelAnimationFrame(animationId);

    if (visible) {
      animationId = requestAnimationFrame(render);
    }
  });

  observer.observe(container);

  window.addEventListener(
    "pagehide",
    () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();
    },
    { once: true },
  );
})();
