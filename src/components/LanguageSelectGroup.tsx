import {
  Select,
  SelectContent,
  SelectGroup,
  SelectGroupLabel,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './Select';

interface LanguageSelectGroupProps {
  onSelect: (value: string) => void;
}

export function LanguageSelectGroup({ onSelect }: LanguageSelectGroupProps) {
  const languageData = [
    {
      label: 'General Information',
      items: [
        { value: 'all-languages', label: 'All U-M Asian Languages' },
      ],
    },
    {
      label: 'Southeast Asia',
      items: [
        { value: 'Thai', label: 'Thai' },
        { value: 'Vietnamese', label: 'Vietnamese' },
        { value: 'Tibetan', label: 'Tibetan' },
        { value: 'Indonesian', label: 'Indonesian' },
        { value: 'Filipino', label: 'Filipino' },
      ],
    },
    {
      label: 'Indian Subcontinent',
      items: [
        { value: 'Telugu', label: 'Telugu' },
        { value: 'Bengali', label: 'Bengali' },
        { value: 'Tamil', label: 'Tamil' },
        { value: 'Hindi', label: 'Hindi' },
        { value: 'Sanskrit', label: 'Sanskrit' },
        { value: 'Urdu', label: 'Urdu' },
        { value: 'Punjabi', label: 'Punjabi' },
      ],
    },
    {
      label: 'East Asia',
      items: [
        { value: 'Chinese', label: 'Chinese' },
        { value: 'Japanese', label: 'Japanese' },
        { value: 'Korean', label: 'Korean' },
      ],
    },
  ];

  const handleSelection = (value: string) => {
    if (onSelect) {
      onSelect(value);
    }
  };

  return (
    <div className="w-[250px]">
      <Select onValueChange={handleSelection}>
        <SelectTrigger>
          <SelectValue placeholder="Select a language" />
        </SelectTrigger>
        <SelectContent className="max-h-96 overflow-y-auto">
          {languageData.map((group) => (
            <SelectGroup key={group.label}>
              <SelectGroupLabel>{group.label}</SelectGroupLabel>
              {group.items.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
