import { TextInput } from 'react-native';

export default function Input(props: any) {
  return (
    <TextInput
      {...props}
      className="border border-gray-300 rounded-xl px-4 py-3 text-base mb-4 bg-white"
    />
  );
}
