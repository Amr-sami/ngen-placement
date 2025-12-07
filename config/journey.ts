export type JourneyStage = {
  id: string;
  color: string;
  bgColor: string; // For card background with opacity
  borderColor: string; // For card border
  textColor: string;
  icon?: string;
};

export const JOURNEY_STAGES: JourneyStage[] = [
  {
    id: 'placement-test',
    color: 'bg-gray-200',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-300',
    textColor: 'text-gray-800',
    icon: 'flag',
  },
  {
    id: 'white',
    color: 'bg-white border-2 border-gray-200',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-300',
    textColor: 'text-gray-800',
  },
  {
    id: 'yellow',
    color: 'bg-yellow',
    bgColor: 'bg-yellow/10',
    borderColor: 'border-yellow',
    textColor: 'text-black',
  },
  {
    id: 'orange',
    color: 'bg-orange-500',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-500',
    textColor: 'text-white',
  },
  {
    id: 'green',
    color: 'bg-green',
    bgColor: 'bg-green/10',
    borderColor: 'border-green',
    textColor: 'text-white',
  },
  {
    id: 'blue',
    color: 'bg-blueberry',
    bgColor: 'bg-blueberry/10',
    borderColor: 'border-blueberry',
    textColor: 'text-white',
  },
  {
    id: 'red',
    color: 'bg-red-500',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-500',
    textColor: 'text-white',
  },
  {
    id: 'brown',
    color: 'bg-amber-800',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-800',
    textColor: 'text-white',
  },
  {
    id: 'black',
    color: 'bg-black',
    bgColor: 'bg-gray-100',
    borderColor: 'border-black',
    textColor: 'text-white',
  },
  {
    id: 'ninja',
    color: 'bg-ninja',
    bgColor: 'bg-ninja/10',
    borderColor: 'border-ninja',
    textColor: 'text-white',
  },
  {
    id: 'master',
    color: 'bg-grandmaster',
    bgColor: 'bg-grandmaster/10',
    borderColor: 'border-grandmaster',
    textColor: 'text-white',
  },
];
