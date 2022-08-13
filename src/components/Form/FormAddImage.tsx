/* eslint-disable prettier/prettier */
import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

interface FormAddImageProps {
  closeModal: () => void;
}

interface ImageProps {
  url:string,
  title:string,
  description:string
}

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const typeFormated = /^([a-zA-Z0-9\s_\\.\-:])+(.jpeg|.gif|.png)$/;

  const sendImage = async (imageData:ImageProps) =>{
    await api.post('/api/images',{
      ...imageData,
      url:imageUrl
    })
  }

  const formValidations  = {
    image: {
      required: 'Arquivo obrigatório',
      validate:{
        lessThan10MB: (files) => 
        files[0].size < 10000000 || 'O arquivo deve ser menor que 10MB',
        acceptedFormats: (types) =>
         typeFormated.test(types[0].type) || 'Somente são aceitos arquivos PNG, JPEG e GIF'
      },
    },
    title: {
      required:'Título obrigatório',
      minLength: {
        value:2,
        message:'Mínimo de 2 caracteres'
      },
      maxLength: {
        value:20,
        message:'Máximo de 20 caracteres'
      }
    },
    description: {
      required:'Descrição obrigatória',
      maxLength: {
        value:65,
        message:'Máximo de 65 caracteres'
      }
    }
  };

  const queryClient = useQueryClient();
  const mutation = useMutation(
    sendImage,{
      onSuccess: ()=>{
        queryClient.invalidateQueries('images')
      }
    },
  );

  const {
    register,
    handleSubmit,
    reset,
    formState,
    setError,
    trigger,
  } = useForm();
  const { errors } = formState;

  const onSubmit = async (data: ImageProps): Promise<void> => {
    try {
      if(!imageUrl){
        toast({
          status:'error',
          title:'Imagem não adicionada',
          description:'É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro.'
        })
        return;
      }
     await mutation.mutateAsync(data)
     toast({
      status:'success',
      title:'Imagem cadastrada',
      description:'Sua imagem foi cadastrada com sucesso.'
    })
    } catch {
      toast({
        status:'error',
        title:'Falha ao cadastrar',
        description:'Ocorreu um erro ao cadastrar a sua imagem'
      })
    } finally {
      reset(),
      closeModal(),
      setImageUrl('')
      setLocalImageUrl('')
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          {...register('image', formValidations.image)}
          error={errors.image}
        />

        <TextInput
          placeholder="Título da imagem..."
          {...register('title', formValidations.title)}
          error={errors.title}
        />

        <TextInput
          placeholder="Descrição da imagem..."
          {...register('description', formValidations.description)}
           error={errors.description}
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}

