import { View, Text } from 'react-native'
import React from 'react'
import { SignOutButton } from '@/components/SignOutButton'

const profile = () => {
  return (
    <View className='flex-1 items-center justify-center'>
      <SignOutButton/>
    </View>
  )
}

export default profile