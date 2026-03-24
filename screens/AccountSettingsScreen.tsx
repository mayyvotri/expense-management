import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

interface AccountSettingsScreenProps {
  navigation: any;
}

const AccountSettingsScreen: React.FC<AccountSettingsScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [monthlyReport, setMonthlyReport] = useState(true);
  const [biometricAuth, setBiometricAuth] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [currency, setCurrency] = useState('VND');

  const handleDeleteAccount = () => {
    Alert.alert(
      'Xóa tài khoản',
      'Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác và tất cả dữ liệu sẽ bị mất.',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => {
            // In a real app, this would call an API to delete the account
            Alert.alert('Thông báo', 'Tính năng này sẽ được cập nhật sau');
          },
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Xuất dữ liệu',
      'Tính năng xuất dữ liệu sẽ được cập nhật sau'
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      'Xóa bộ nhớ đệm',
      'Bạn có muốn xóa bộ nhớ đệm ứng dụng?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          onPress: () => {
            // In a real app, this would clear the cache
            Alert.alert('Thành công', 'Đã xóa bộ nhớ đệm');
          },
        },
      ]
    );
  };

  const SettingItem = ({ 
    title, 
    subtitle, 
    value, 
    onToggle, 
    type = 'toggle' 
  }: {
    title: string;
    subtitle?: string;
    value?: boolean;
    onToggle?: () => void;
    type?: 'toggle' | 'action' | 'navigation';
  }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {type === 'toggle' && (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: '#E5E5E5', true: '#007AFF' }}
          thumbColor={value ? '#FFFFFF' : '#FFFFFF'}
        />
      )}
      {type === 'action' && (
        <TouchableOpacity onPress={onToggle}>
          <Text style={styles.actionText}>Thực hiện</Text>
        </TouchableOpacity>
      )}
      {type === 'navigation' && (
        <Text style={styles.navigationArrow}>›</Text>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông báo</Text>
        
        <SettingItem
          title="Thông báo đẩy"
          subtitle="Nhận thông báo về giao dịch và cập nhật"
          value={notifications}
          onToggle={() => setNotifications(!notifications)}
        />
        
        <SettingItem
          title="Thông báo email"
          subtitle="Nhận báo cáo qua email"
          value={emailNotifications}
          onToggle={() => setEmailNotifications(!emailNotifications)}
        />
        
        <SettingItem
          title="Báo cáo hàng tháng"
          subtitle="Tự động gửi báo cáo tổng kết hàng tháng"
          value={monthlyReport}
          onToggle={() => setMonthlyReport(!monthlyReport)}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bảo mật</Text>
        
        <SettingItem
          title="Xác thực sinh trắc học"
          subtitle="Sử dụng vân tay hoặc Face ID để đăng nhập"
          value={biometricAuth}
          onToggle={() => setBiometricAuth(!biometricAuth)}
        />
        
        <SettingItem
          title="Đổi mật khẩu"
          subtitle="Thay đổi mật khẩu tài khoản"
          type="navigation"
          onToggle={() => navigation.navigate('ChangePassword')}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Giao diện</Text>
        
        <SettingItem
          title="Chế độ tối"
          subtitle="Sử dụng giao diện tối để bảo vệ mắt"
          value={darkMode}
          onToggle={() => setDarkMode(!darkMode)}
        />
        
        <SettingItem
          title="Đơn vị tiền tệ"
          subtitle={`Hiện tại: ${currency}`}
          type="navigation"
          onToggle={() => Alert.alert('Thông báo', 'Tính năng sẽ được cập nhật sau')}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dữ liệu</Text>
        
        <SettingItem
          title="Xuất dữ liệu"
          subtitle="Tải xuống tất cả dữ liệu giao dịch của bạn"
          type="action"
          onToggle={handleExportData}
        />
        
        <SettingItem
          title="Xóa bộ nhớ đệm"
          subtitle="Giải phóng dung lượng bộ nhớ"
          type="action"
          onToggle={handleClearCache}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông tin tài khoản</Text>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>ID người dùng</Text>
          <Text style={styles.infoValue}>{user?.id}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Ngày tạo tài khoản</Text>
          <Text style={styles.infoValue}>
            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
          </Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Phiên bản ứng dụng</Text>
          <Text style={styles.infoValue}>1.0.0</Text>
        </View>
      </View>

      <View style={styles.dangerSection}>
        <Text style={styles.dangerTitle}>Hành động nguy hiểm</Text>
        
        <TouchableOpacity style={styles.dangerButton} onPress={handleDeleteAccount}>
          <Text style={styles.dangerButtonText}>Xóa tài khoản</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Quản lý chi tiêu © 2024</Text>
        <Text style={styles.footerText}>Phiên bản 1.0.0</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: 'white',
    marginBottom: 20,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#f8f8f8',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingInfo: {
    flex: 1,
    marginRight: 15,
  },
  settingTitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  actionText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  navigationArrow: {
    fontSize: 20,
    color: '#C7C7CC',
    fontWeight: 'bold',
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  dangerSection: {
    backgroundColor: 'white',
    marginBottom: 20,
    paddingVertical: 10,
  },
  dangerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFF5F5',
  },
  dangerButton: {
    marginHorizontal: 20,
    marginVertical: 10,
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  dangerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  footerText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 5,
  },
});

export default AccountSettingsScreen;
