import React, { useState, useEffect } from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useTheme } from "@/app/providers/ThemeProvider";

type IOSCategoryPickerProps = {
  visible: boolean;
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
  options: ReadonlyArray<{ label: string; value: string }>;
};

export const IOSCategoryPicker: React.FC<IOSCategoryPickerProps> = ({
  visible,
  value,
  onChange,
  onClose,
  options,
}) => {
  const { mode } = useTheme();

  const [selected, setSelected] = useState(value);

  useEffect(() => {
    if (visible) setSelected(value);
  }, [visible, value]);

  const sheetBg = mode === "dark" ? "#1e1e1e" : "#fff";
  const textColor = mode === "dark" ? "#e5e5e5" : "#111";
  const overlay = "#00000055";
  const accent = mode === "dark" ? "#60a5fa" : "#2563eb";

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, justifyContent: "flex-end", backgroundColor: overlay }}>
        <View
          style={{
            backgroundColor: sheetBg,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 12 }}>
            <TouchableOpacity onPress={onClose}>
              <Text style={{ color: accent }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                onChange(selected); 
                onClose();
              }}
            >
              <Text style={{ color: accent, fontWeight: "600" }}>Done</Text>
            </TouchableOpacity>
          </View>

          <Picker
            selectedValue={selected}
            onValueChange={(v) => setSelected(v)}
            itemStyle={{ fontSize: 18, color: textColor }}
          >
            <Picker.Item label="Select category..." value="" />
            {options.map((c) => (
              <Picker.Item key={c.value} label={c.label} value={c.value} />
            ))}
          </Picker>
        </View>
      </View>
    </Modal>
  );
};
