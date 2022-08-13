/* eslint-disable prettier/prettier */
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Image,
  Link,
} from '@chakra-ui/react';

interface ModalViewImageProps {
  isOpen: boolean;
  onClose: () => void;
  imgUrl: string;
}

export function ModalViewImage({
  isOpen,
  onClose,
  imgUrl
}: ModalViewImageProps): JSX.Element {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="4xl">
      <ModalOverlay />
      <ModalContent
       mx='auto'
       w="auto"
       max={['300px','500px', '900px']}
       maH={['350px','450px', '600px']}
      >
        <ModalBody p="0">
          <Image
           src={imgUrl} 
           w="auto"
           max={['300px','500px', '900px']}
           maH={['350px','450px', '600px']}
          />
        </ModalBody>
        <ModalFooter bg="pGray.800" h='2rem' py="20px" borderBottomEndRadius="5px">
          <Link href={imgUrl} isExternal fontSize="1rem" mr="auto">
          Abrir original
          </Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
