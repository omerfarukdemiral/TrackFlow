import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Typography,
  Tooltip,
  Box
} from '@mui/material';
import { TrackingEvent } from '../types/tracking';
import { TimeFilter } from '../types/filters';
import { filterDataByTime } from '../utils/filters';

interface ClickStatsProps {
  data: TrackingEvent[];
  timeFilter: TimeFilter;
}

interface ClickStat {
  element: string;
  count: number;
  percentage: number;
}

const truncateText = (text: string, maxLength: number = 30) => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

export default function ClickStats({ data, timeFilter }: ClickStatsProps) {
  const filteredData = filterDataByTime(data, timeFilter).filter(event => event.event_type === 'click');
  
  const stats = filteredData.reduce((acc: { [key: string]: number }, event) => {
    const elementKey = `${event.element.tag}${event.element.id ? `#${event.element.id}` : ''}${event.element.class ? `.${event.element.class}` : ''}`;
    acc[elementKey] = (acc[elementKey] || 0) + 1;
    return acc;
  }, {});

  const totalClicks = Object.values(stats).reduce((sum, count) => sum + count, 0);
  
  const formattedStats: ClickStat[] = Object.entries(stats)
    .map(([element, count]) => ({
      element,
      count,
      percentage: (count / totalClicks) * 100
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Toplam Tıklama: {totalClicks}
      </Typography>
      
      <TableContainer>
        <Table size="small" sx={{ tableLayout: 'fixed' }}>
          <TableHead>
            <TableRow>
              <TableCell width="50%">Element</TableCell>
              <TableCell align="right" width="25%">Tıklama</TableCell>
              <TableCell align="right" width="25%">Oran</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {formattedStats.map((stat) => (
              <TableRow key={stat.element}>
                <TableCell 
                  component="th" 
                  scope="row" 
                  sx={{ 
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  <Tooltip title={stat.element} placement="top-start">
                    <Box component="span" sx={{ cursor: 'help' }}>
                      {truncateText(stat.element)}
                    </Box>
                  </Tooltip>
                </TableCell>
                <TableCell align="right">{stat.count}</TableCell>
                <TableCell align="right">{stat.percentage.toFixed(1)}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
} 