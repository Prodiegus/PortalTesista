#!/bin/bash
# === COLORES ===
NC='\033[0m'; RED='\033[0;31m'; GREEN='\033[0;32m'
YELLOW='\033[1;33m'; BLUE='\033[1;34m'; GRAY='\033[0;37m'

# === PRETTY TIME ===
pretty_time() {
  local ms=$1
  local s=$((ms / 1000))
  local ms_rem=$((ms % 1000))

  if [ $s -lt 60 ]; then
    printf "%d.%03d s" "$s" "$ms_rem"
  else
    local min=$((s / 60))
    local sec=$((s % 60))
    if [ $min -lt 60 ]; then
      printf "%d min %d.%03d s" "$min" "$sec" "$ms_rem"
    else
      local hr=$((min / 60))
      local rem_min=$((min % 60))
      printf "%d h %d min %d.%03d s" "$hr" "$rem_min" "$sec" "$ms_rem"
    fi
  fi
}

# === BARRA DE PROGRESO SINCRONIZADA CON PROCESO ===
progress_bar_sync() {
  local pid=$1
  local chars=( '|' '/' '-' '\' )
  local i=0
  local bar=""
  local max=40

  printf "["
  while kill -0 "$pid" 2>/dev/null; do
    bar+="#"
    printf "%s" "#"
    ((i++))
    if [ $i -ge $max ]; then
      bar=""
      i=0
      printf "\r[%-${max}s]" " "
      printf "\r["
    fi
    sleep 0.2
  done
  printf "%-${max}s]\n" "$bar"
}

echo -e "${BLUE}🚀 Ejecutando pruebas hasta obtener cobertura válida...${NC}"
intento=1
tiempo_total_inicio=$(date +%s%3N)

while true; do
  echo -e "${YELLOW}▶ Intento $intento...${NC}"
  inicio=$(date +%s%3N)

  echo -e "${GRAY}⏳ Ejecutando pruebas unitarias y generando cobertura...${NC}"

  # Ejecuta ng test en segundo plano
  (ng test --code-coverage --watch=false --browsers=ChromeHeadless > test_output.txt 2>&1) &
  pid_ng_test=$!

  # Muestra barra de progreso sincronizada
  progress_bar_sync $pid_ng_test

  wait $pid_ng_test
  fin=$(date +%s%3N)
  duracion=$((fin - inicio))

  summary=$(grep -A 4 "Coverage summary" test_output.txt)

  if ! echo "$summary" | grep -q "Unknown% ( 0/0 )"; then
    cat test_output.txt
    echo -e "${GREEN}✅ Cobertura generada con datos reales en $(pretty_time $duracion).${NC}"
    break
  else
    echo -e "${RED}❌ Cobertura vacía, repitiendo (duración: $(pretty_time $duracion)).${NC}"
    intento=$((intento + 1))
  fi
done

tiempo_total_fin=$(date +%s%3N)
duracion_total=$((tiempo_total_fin - tiempo_total_inicio))

echo ""
echo -e "${BLUE}📋 Resumen final:${NC}"
echo -e "${YELLOW} - Intentos realizados: $intento${NC}"
echo -e "${YELLOW} - Tiempo total: $(pretty_time $duracion_total)${NC}"
