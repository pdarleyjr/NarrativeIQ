/**
 * Icon Library for EZ Narratives
 * 
 * This file exports commonly used icons from the Heroicons library.
 * Import icons from this file instead of directly from @heroicons/react
 * to ensure consistent icon usage throughout the application.
 * 
 * Example usage:
 * import { DocumentIcon, PlusIcon } from '@/components/icons';
 */

// Import from Outline style (lighter, stroke-based icons)
export {
  // Document related
  DocumentTextIcon,
  DocumentIcon,
  DocumentDuplicateIcon,
  DocumentDownloadIcon,
  DocumentAddIcon,
  DocumentRemoveIcon,
  DocumentReportIcon,
  
  // Actions
  PlusIcon,
  PlusCircleIcon,
  MinusIcon,
  MinusCircleIcon,
  XIcon,
  CheckIcon,
  CheckCircleIcon,
  
  // Navigation
  HomeIcon,
  MenuIcon,
  DotsHorizontalIcon,
  DotsVerticalIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  
  // User related
  UserIcon,
  UserGroupIcon,
  UserAddIcon,
  UserRemoveIcon,
  UserCircleIcon,
  
  // UI elements
  SearchIcon,
  BellIcon,
  CogIcon,
  AdjustmentsIcon,
  ExclamationIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  QuestionMarkCircleIcon,
  MoonIcon,
  SunIcon,
  
  // Data visualization
  ChartBarIcon,
  ChartPieIcon,
  ChartSquareBarIcon,
  
  // Communication
  MailIcon,
  ChatIcon,
  ChatAltIcon,
  
  // Misc
  ClockIcon,
  CalendarIcon,
  LocationMarkerIcon,
  GlobeIcon,
  ShieldCheckIcon,
  LightningBoltIcon,
  FireIcon,
  HeartIcon,
  StarIcon,
  BookmarkIcon,
  TagIcon,
  FolderIcon,
  DownloadIcon,
  UploadIcon,
  RefreshIcon,
  SaveIcon,
  TrashIcon,
  PencilIcon,
  PencilAltIcon,
  EyeIcon,
  EyeOffIcon,
  LockClosedIcon,
  LockOpenIcon
} from '@heroicons/react/outline';

// Import from Solid style (filled icons)
// Use the 'Solid' variants for active states, selected items, etc.
export {
  // Document related
  DocumentTextIcon as DocumentTextIconSolid,
  DocumentIcon as DocumentIconSolid,
  
  // Actions
  PlusIcon as PlusIconSolid,
  PlusCircleIcon as PlusCircleIconSolid,
  CheckIcon as CheckIconSolid,
  CheckCircleIcon as CheckCircleIconSolid,
  
  // Navigation
  HomeIcon as HomeIconSolid,
  
  // User related
  UserIcon as UserIconSolid,
  UserCircleIcon as UserCircleIconSolid,
  
  // UI elements
  SearchIcon as SearchIconSolid,
  BellIcon as BellIconSolid,
  CogIcon as CogIconSolid,
  MoonIcon as MoonIconSolid,
  SunIcon as SunIconSolid,
  
  // Data visualization
  ChartBarIcon as ChartBarIconSolid,
  
  // Misc
  StarIcon as StarIconSolid,
  BookmarkIcon as BookmarkIconSolid,
  HeartIcon as HeartIconSolid,
  FireIcon as FireIconSolid
} from '@heroicons/react/solid';