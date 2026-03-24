import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DataService from '../services/DataService';
import { Transaction, Category } from '../types';

interface AddEditTransactionScreenProps {
  route: any;
  navigation: any;
}

const AddEditTransactionScreen: React.FC<AddEditTransactionScreenProps> = ({ route, navigation }) => {
  const { type, id } = route.params;
  const isEditing = !!id;
  
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const filteredCategories = DataService.getCategories(type);
    setCategories(filteredCategories);
    
    if (isEditing) {
      const transaction = DataService.getTransactionById(id);
      if (transaction) {
        setAmount(transaction.amount.toString());
        setDescription(transaction.description);
        setCategoryId(transaction.categoryId);
        setDate(new Date(transaction.date));
      }
    } else {
      // Set default category if available
      if (filteredCategories.length > 0) {
        setCategoryId(filteredCategories[0].id);
      }
    }
  }, [type, id, isEditing]);

  const handleSave = () => {
    if (!amount || !description || !categoryId) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert('Lỗi', 'Số tiền phải là số dương');
      return;
    }

    try {
      if (isEditing) {
        DataService.updateTransaction(id, {
          amount: amountNum,
          description,
          categoryId,
          date,
          type,
        });
        Alert.alert('Thành công', 'Cập nhật giao dịch thành công');
      } else {
        DataService.addTransaction({
          amount: amountNum,
          description,
          categoryId,
          date,
          type,
        });
        Alert.alert('Thành công', 'Thêm giao dịch thành công');
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể lưu giao dịch');
    }
  };

  const handleDelete = () => {
    if (!isEditing) return;
    
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc muốn xóa giao dịch này?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => {
            DataService.deleteTransaction(id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const formatCurrency = (value: string) => {
    const cleanValue = value.replace(/[^\d]/g, '');
    const number = parseInt(cleanValue);
    if (isNaN(number)) return '';
    return new Intl.NumberFormat('vi-VN').format(number);
  };

  const handleAmountChange = (text: string) => {
    const cleanValue = text.replace(/[^\d]/g, '');
    setAmount(cleanValue);
  };

  const getCategoryName = (categoryId: string) => {
    const category = DataService.getCategoryById(categoryId);
    return category ? category.name : 'Chọn danh mục';
  };

  const getCategoryColor = (categoryId: string) => {
    const category = DataService.getCategoryById(categoryId);
    return category ? category.color : '#999';
  };

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => {
        setCategoryId(item.id);
        setShowCategoryModal(false);
      }}
    >
      <View style={[styles.categoryColor, { backgroundColor: item.color }]} />
      <Text style={styles.categoryName}>{item.name}</Text>
      {categoryId === item.id && (
        <Text style={styles.selectedIcon}>✓</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Số tiền</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={handleAmountChange}
            placeholder="Nhập số tiền"
            keyboardType="numeric"
          />
          <Text style={styles.currencyHint}>VND</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mô tả</Text>
          <TextInput
            style={styles.input}
            value={description}
            onChangeText={setDescription}
            placeholder="Nhập mô tả giao dịch"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Danh mục</Text>
          <TouchableOpacity
            style={styles.categorySelector}
            onPress={() => setShowCategoryModal(true)}
          >
            <View style={styles.selectedCategory}>
              <View
                style={[styles.categoryColor, { backgroundColor: getCategoryColor(categoryId) }]}
              />
              <Text style={styles.categoryText}>
                {getCategoryName(categoryId)}
              </Text>
            </View>
            <Text style={styles.dropdownIcon}>▼</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Ngày</Text>
          <TouchableOpacity
            style={styles.dateSelector}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateText}>
              {date.toLocaleDateString('vi-VN')}
            </Text>
            <Text style={styles.dropdownIcon}>▼</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>
              {isEditing ? 'Cập nhật' : 'Lưu'}
            </Text>
          </TouchableOpacity>
          
          {isEditing && (
            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
              <Text style={styles.deleteButtonText}>Xóa</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <Modal
        visible={showCategoryModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chọn danh mục</Text>
              <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={categories}
              renderItem={renderCategoryItem}
              keyExtractor={(item) => item.id}
              style={styles.categoryList}
            />
          </View>
        </View>
      </Modal>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  currencyHint: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  categorySelector: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedCategory: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryColor: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 16,
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#666',
  },
  dateSelector: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#F44336',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 20,
    color: '#666',
  },
  categoryList: {
    flex: 1,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryName: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
  selectedIcon: {
    fontSize: 18,
    color: '#2196F3',
    fontWeight: 'bold',
  },
});

export default AddEditTransactionScreen;
