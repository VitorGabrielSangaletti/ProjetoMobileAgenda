import { TouchableOpacity, Text } from 'react-native'
import { bannerAlertaStyles as styles } from '../styles/componentStyles'

export default function BannerAlerta({ quantidade, aoPress }) {
  if (quantidade === 0) return null
  return (
    <TouchableOpacity style={styles.banner} onPress={aoPress}>
      <Text style={styles.texto}>
        🔔 {quantidade} evento{quantidade > 1 ? 's' : ''} urgente{quantidade > 1 ? 's' : ''} nas próximas 24h
      </Text>
    </TouchableOpacity>
  )
}
