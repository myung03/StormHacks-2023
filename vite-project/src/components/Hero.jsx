import React from 'react'
import { Button, Stack } from '@chakra-ui/react'

const Hero = () => {
  return (
            <Stack spacing={10} direction='row' align='center'>
  <Button class='text-xs' colorScheme='red' size='xs'>
    Button
  </Button>
  <Button colorScheme='teal' size='sm'>
    Button
  </Button>
  <Button colorScheme='teal' size='md'>
    Button
  </Button>
  <Button colorScheme='teal' size='lg'>
    Button
  </Button>
</Stack>
  )
}

export default Hero