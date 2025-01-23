import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Box, Typography, ToggleButtonGroup, ToggleButton, Paper } from '@mui/material';
import { TrackingEvent } from '../types/tracking';
import { TimeFilter, EventTypeFilter } from '../types/filters';
import { filterDataByTime, filterDataByEventType } from '../utils/filters';
import MouseIcon from '@mui/icons-material/Mouse';
import TouchAppIcon from '@mui/icons-material/TouchApp';

interface HeatMapProps {
  data: TrackingEvent[];
  timeFilter: TimeFilter;
}

const HeatMap: React.FC<HeatMapProps> = ({ data, timeFilter }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [eventTypeFilter, setEventTypeFilter] = useState<EventTypeFilter>('all');

  // Veriyi filtrele
  const filteredData = filterDataByEventType(
    filterDataByTime(data, timeFilter),
    eventTypeFilter
  );

  useEffect(() => {
    if (!filteredData.length || !svgRef.current || !containerRef.current) return;

    // Container boyutlarını al
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = Math.min(containerWidth * 0.7, 700);

    // SVG'yi temizle
    d3.select(svgRef.current).selectAll("*").remove();

    // SVG'yi oluştur
    const svg = d3.select(svgRef.current)
      .attr("width", containerWidth)
      .attr("height", containerHeight)
      .style("background", "#2a2a2a");

    // Ölçeklendirme için extent hesapla
    const xExtent = d3.extent(filteredData, d => d.element.position.x) as [number, number];
    const yExtent = d3.extent(filteredData, d => d.element.position.y) as [number, number];

    // Ölçeklendirme fonksiyonları
    const xScale = d3.scaleLinear()
      .domain([0, Math.max(xExtent[1], window.innerWidth)])
      .range([0, containerWidth]);

    const yScale = d3.scaleLinear()
      .domain([0, Math.max(yExtent[1], window.innerHeight)])
      .range([0, containerHeight]);

    // Grid boyutlarını belirle (daha küçük grid hücreleri)
    const gridSize = 10; // 20'den 10'a düşürdük
    const numCols = Math.floor(containerWidth / gridSize);
    const numRows = Math.floor(containerHeight / gridSize);

    // Grid hücrelerini oluştur
    const grid = new Array(numRows).fill(0).map(() => new Array(numCols).fill(0));

    // Veri noktalarını grid hücrelerine dağıt
    filteredData.forEach(d => {
      const x = Math.floor(xScale(d.element.position.x) / gridSize);
      const y = Math.floor(yScale(d.element.position.y) / gridSize);
      if (x >= 0 && x < numCols && y >= 0 && y < numRows) {
        grid[y][x]++;
      }
    });

    // Maksimum yoğunluğu bul
    const maxDensity = Math.max(...grid.flat());

    // Renk skalası
    const colorScale = d3.scaleSequential<string>()
      .domain([0, maxDensity])
      .interpolator(d3.interpolateInferno);

    // Grid hücrelerini çiz
    grid.forEach((row, y) => {
      row.forEach((density, x) => {
        if (density > 0) {
          svg.append("rect")
            .attr("x", x * gridSize)
            .attr("y", y * gridSize)
            .attr("width", gridSize)
            .attr("height", gridSize)
            .attr("fill", colorScale(density))
            .attr("opacity", 0.7);
        }
      });
    });

    // Veri noktalarını çiz
    svg.selectAll("circle")
      .data(filteredData)
      .join("circle")
      .attr("cx", d => xScale(d.element.position.x))
      .attr("cy", d => yScale(d.element.position.y))
      .attr("r", 1.5) // Nokta boyutunu küçülttük
      .attr("fill", "white")
      .attr("opacity", 0.2);

    // Lejant oluştur
    const legendHeight = 20;
    const legendWidth = 200;
    const legendMargin = { top: 20, right: 20 };

    const legendScale = d3.scaleLinear()
      .domain([0, maxDensity])
      .range([0, legendWidth]);

    const legendAxis = d3.axisBottom(legendScale)
      .ticks(5)
      .tickFormat(d => `${Math.round(Number(d))}`);

    const legend = svg.append("g")
      .attr("transform", `translate(${containerWidth - legendWidth - legendMargin.right}, ${legendMargin.top})`);

    // Gradient tanımla
    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
      .attr("id", "heatmap-gradient")
      .attr("x1", "0%")
      .attr("x2", "100%")
      .attr("y1", "0%")
      .attr("y2", "0%");

    // Gradient renk durakları
    const numStops = 10;
    for (let i = 0; i <= numStops; i++) {
      const offset = i / numStops;
      gradient.append("stop")
        .attr("offset", `${offset * 100}%`)
        .attr("stop-color", colorScale(maxDensity * offset));
    }

    // Lejant arka planı
    legend.append("rect")
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .style("fill", "url(#heatmap-gradient)");

    // Lejant ekseni
    legend.append("g")
      .attr("transform", `translate(0, ${legendHeight})`)
      .call(legendAxis)
      .selectAll("text")
      .style("fill", "white")
      .style("font-size", "12px");

    // Lejant başlığı
    legend.append("text")
      .attr("x", 0)
      .attr("y", -5)
      .style("fill", "white")
      .style("font-size", "12px")
      .text("Etkileşim Yoğunluğu");

  }, [filteredData]);

  return (
    <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <ToggleButtonGroup
          value={eventTypeFilter}
          exclusive
          onChange={(_, value) => value && setEventTypeFilter(value)}
          size="small"
        >
          <ToggleButton value="all">
            Tümü
          </ToggleButton>
          <ToggleButton value="mousemove">
            <MouseIcon sx={{ mr: 1 }} />
            Gezinme
          </ToggleButton>
          <ToggleButton value="click">
            <TouchAppIcon sx={{ mr: 1 }} />
            Tıklama
          </ToggleButton>
        </ToggleButtonGroup>

        <Typography variant="body2" color="text.secondary">
          {filteredData.length} etkileşim
        </Typography>
      </Box>

      <Box ref={containerRef} sx={{ 
        width: '100%', 
        height: 'calc(100% - 100px)',
        position: 'relative' 
      }}>
        {filteredData.length === 0 ? (
          <Paper 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              height: '100%',
              bgcolor: 'background.paper'
            }}
          >
            <Typography color="text.secondary">Bu zaman aralığında veri bulunmuyor</Typography>
          </Paper>
        ) : (
          <svg
            ref={svgRef}
            style={{
              width: '100%',
              height: '100%',
              maxHeight: '700px'
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default HeatMap; 