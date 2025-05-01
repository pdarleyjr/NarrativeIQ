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
// Import from Outline style (lighter, stroke-based icons)
export {
  // Document related
  DocumentTextIcon,
  DocumentIcon,
  DocumentDuplicateIcon,
  DocumentArrowDownIcon as DocumentDownloadIcon,
  PlusCircleIcon as DocumentAddIcon,
  MinusCircleIcon as DocumentRemoveIcon,
  DocumentChartBarIcon as DocumentReportIcon,
  
  // Actions
  PlusIcon,
  PlusCircleIcon,
  MinusIcon,
  MinusCircleIcon,
  XMarkIcon as XIcon,
  CheckIcon,
  CheckCircleIcon,
  
  // Navigation
  HomeIcon,
  Bars3Icon as MenuIcon,
  EllipsisHorizontalIcon as DotsHorizontalIcon,
  EllipsisVerticalIcon as DotsVerticalIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  
  // User related
  UserIcon,
  UserGroupIcon,
  UserPlusIcon as UserAddIcon,
  UserMinusIcon as UserRemoveIcon,
  UserCircleIcon,
  
  // UI elements
  MagnifyingGlassIcon as SearchIcon,
  BellIcon,
  Cog6ToothIcon as CogIcon,
  AdjustmentsHorizontalIcon as AdjustmentsIcon,
  ExclamationTriangleIcon as ExclamationIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  QuestionMarkCircleIcon,
  MoonIcon,
  SunIcon,
  
  // Data visualization
  ChartBarIcon,
  ChartPieIcon,
  TableCellsIcon as ChartSquareBarIcon,
  
  // Communication
  EnvelopeIcon as MailIcon,
  ChatBubbleLeftIcon as ChatIcon,
  ChatBubbleLeftEllipsisIcon as ChatAltIcon,
  
  // Misc
  ClockIcon,
  CalendarIcon,
  MapPinIcon as LocationMarkerIcon,
  GlobeAltIcon as GlobeIcon,
  ShieldCheckIcon,
  BoltIcon as LightningBoltIcon,
  FireIcon,
  HeartIcon,
  StarIcon,
  BookmarkIcon,
  TagIcon,
  FolderIcon,
  ArrowDownTrayIcon as DownloadIcon,
  ArrowUpTrayIcon as UploadIcon,
  ArrowPathIcon as RefreshIcon,
  BookmarkSquareIcon as SaveIcon,
  TrashIcon,
  PencilIcon,
  PencilSquareIcon as PencilAltIcon,
  EyeIcon,
  EyeSlashIcon as EyeOffIcon,
  LockClosedIcon,
  LockOpenIcon
} from '@heroicons/react/24/outline';

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
  MagnifyingGlassIcon as SearchIconSolid,
  BellIcon as BellIconSolid,
  Cog6ToothIcon as CogIconSolid,
  MoonIcon as MoonIconSolid,
  SunIcon as SunIconSolid,
  
  // Data visualization
  ChartBarIcon as ChartBarIconSolid,
  
  // Misc
  StarIcon as StarIconSolid,
  BookmarkIcon as BookmarkIconSolid,
  HeartIcon as HeartIconSolid,
  FireIcon as FireIconSolid
} from '@heroicons/react/24/solid';