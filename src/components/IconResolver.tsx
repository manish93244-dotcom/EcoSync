import { 
  Leaf, 
  Droplet, 
  Cpu, 
  Sun, 
  ThermometerSun, 
  SlidersHorizontal,
  Activity,
  Lightbulb,
  Gauge,
  Thermometer,
  Zap,
  HelpCircle,
  Clock
} from 'lucide-react';

interface IconResolverProps {
  name: string;
  className?: string;
  size?: number;
}

export default function IconResolver({ name, className = '', size = 20 }: IconResolverProps) {
  switch (name) {
    case 'Leaf':
    case 'eco':
      return <Leaf className={className} size={size} />;
    case 'Droplet':
    case 'water_drop':
      return <Droplet className={className} size={size} />;
    case 'Cpu':
    case 'ev_station':
      return <Cpu className={className} size={size} />;
    case 'Sun':
    case 'solar':
      return <Sun className={className} size={size} />;
    case 'ThermometerSun':
    case 'heat_pump':
      return <ThermometerSun className={className} size={size} />;
    case 'Lightbulb':
      return <Lightbulb className={className} size={size} />;
    case 'Gauge':
      return <Gauge className={className} size={size} />;
    case 'Thermometer':
      return <Thermometer className={className} size={size} />;
    case 'Zap':
      return <Zap className={className} size={size} />;
    case 'Clock':
      return <Clock className={className} size={size} />;
    case 'Activity':
      return <Activity className={className} size={size} />;
    default:
      return <SlidersHorizontal className={className} size={size} />;
  }
}
