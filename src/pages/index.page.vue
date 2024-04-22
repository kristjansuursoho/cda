<template>
  <main class="flex flex-col items-center py-24 px-6 space-y-6">
    <div
      class="flex flex-col max-w-3xl w-full mx-auto rounded-xl border"
      :class="{
        'border-zinc-200': !digiStore.token,
        'bg-white shadow-md': digiStore.token,
      }"
    >
      <div class="flex flex-col px-8 py-8">
        <h1 class="text-2xl font-medium mb-1">Upload and attach documents</h1>
        <p class="text-sm text-zinc-700">
          Upload document, receive accounting data within seconds
        </p>
      </div>

      <div class="flex flex-col px-8">
        <ProgressBar
          v-if="isProcessingDocument"
          mode="indeterminate"
          style="height: 6px"
        ></ProgressBar>

        <div v-else class="flex items-center justify-center w-full">
          <div
            v-if="uploaderDocument?.previewUrl"
            class="flex flex-col items-center justify-center rounded-lg overflow-hidden w-full bg-zinc-900 shadow-sm"
          >
            <img
              :src="uploaderDocument?.previewUrl"
              alt=""
              class="object-contain max-h-[600px]"
            />
          </div>

          <label
            v-else
            for="dropzone-file"
            class="border rounded-lg border-zinc-300 border-dashed w-full"
            :class="{
              'hover:border-zinc-900 hover:bg-zinc-100 cursor-pointer':
                isDocumentInputEnabled,
              'bg-zinc-100 cursor-no-drop': !isDocumentInputEnabled,
            }"
          >
            <div
              class="flex flex-col items-center justify-center text-center px-24 py-24"
              :class="{
                'opacity-60': isUploading,
              }"
            >
              <span class="text-zinc-700 mb-2">
                <span class="font-medium text-zinc-900 underline">
                  Click to upload
                </span>
                <span> or drag and drop</span>
              </span>
              <span class="text-xs text-zinc-700">
                Maximum document size 50mb (PDF, JPEG, PNG)
              </span>
            </div>

            <input
              id="dropzone-file"
              type="file"
              class="hidden"
              ref="documentInput"
              @change="onDocumentUpload"
              :disabled="!isDocumentInputEnabled"
              :accept="listOfAllowedType.join(',')"
            />
          </label>
        </div>
      </div>

      <div class="flex items-end px-8 pt-4 pb-8 space-x-4">
        <div class="flex-1"></div>

        <Button
          v-if="uploaderDocument && !uploaderDocument.isUploaded"
          :disabled="isUploading"
          @click="() => (uploaderDocument = null)"
          severity="secondary"
          label="Cancel"
        />

        <Button
          v-if="uploaderDocument && !uploaderDocument.isUploaded"
          :loading="isUploading"
          :disabled="!digiStore.token"
          label="Confirm & Upload"
          v-tooltip.top="!digiStore.token ? 'Missing token' : null"
          @click="confirmAndUpload"
        />
      </div>
    </div>

    <div
      class="flex flex-col max-w-3xl w-full mx-auto rounded-xl border border-zinc-200"
      :class="{
        'bg-zinc-200 ': !digiStore.token,
        '': digiStore.token,
      }"
    >
      <div class="flex flex-col px-8 pt-8 pb-4">
        <h1 class="text-2xl mb-1">Add token</h1>
        <p class="text-sm text-zinc-700">
          First, add your token from digi.costpocket.com
        </p>
      </div>
      <div class="flex px-8 pb-8">
        <div class="flex-1 flex items-center space-x-4">
          <InputText
            type="text"
            v-model="localToken"
            :disabled="isString(digiStore.token) ?? false"
            variant="filled"
            class="w-full"
          />
        </div>

        <div class="flex items-center space-x-4">
          <div class="flex-1"></div>

          <template v-if="digiStore.token">
            <Button
              :severity="digiStore.token ? 'secondary' : 'primary'"
              @click="
                () => {
                  digiStore.removeToken()
                  localToken = ''
                  isAddingToken = true
                }
              "
              :disabled="isUploading"
              label="Remove"
            />
          </template>

          <template v-else>
            <Button
              v-if="!digiStore.token"
              @click="
                () => {
                  digiStore.commitToken(localToken)
                  localToken = `${localToken.substring(0, 3)}...`
                  isAddingToken = false
                }
              "
              :disabled="localToken.length < 3"
              :severity="localToken.length > 3 ? 'primary' : 'secondary'"
              label="Save"
            />
          </template>
        </div>
      </div>
    </div>

    <div class="flex max-w-3xl w-full mx-auto py-6 px-8">
      <span>
        Supported browsers: Firefox, Chrome
        <br />
        Powered by CostPocket.
      </span>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useDigiStore } from '@/stores/digi.store'
import Button from 'primevue/button'
import Badge from 'primevue/badge'
import ProgressBar from 'primevue/progressbar'
import { computed, ref } from 'vue'
import InputText from 'primevue/inputtext'
import { convertFiletoDataUrl, isString } from '../utils/helpers'
import { convertPdfToPNG } from '../utils/pdf-to-png'
import { drawBoxOnImage } from '../utils/process-image'
import InputSwitch from 'primevue/inputswitch'
import type { Box } from '@/types'

// GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.js`

const MAX_FILE_SIZE = 10000000
const listOfAllowedType = [
  'image/png',
  'image/jpeg',
  'application/pdf',
  'application/x-pdf',
  'application/x-bzpdf',
  'application/x-gzpdf',
]

const listOfHiddenField = ['documentId']

const digiStore = useDigiStore()

type UploaderDocument = {
  name: string
  size: number
  type: string
  previewUrl: string | null
  isUploaded: boolean
  file: File
}

const documentInput = ref<HTMLInputElement | null>(null)
const uploaderDocument = ref<UploaderDocument | null>(null)
const isUploading = ref(false)
const isProcessingDocument = ref(false)

const token = (digiStore.token ?? '').substring(0, 3)
const localToken = ref(token ? `${token}...` : '')
const isAddingToken = ref(false)

const isDocumentInputEnabled = computed(
  () => !isUploading || (isString(digiStore.token) ?? false)
)

async function onDocumentUpload() {
  try {
    isProcessingDocument.value = true
    let documentFile = (documentInput.value?.files ?? [])[0]

    if (!documentFile || !listOfAllowedType.includes(documentFile.type)) {
      alert('Missing valid document. Please try again.')
      return
    }

    if (documentFile.type === 'application/pdf') {
      const listOfPdfFile = await convertPdfToPNG(documentFile)
      documentFile = Array.isArray(listOfPdfFile)
        ? listOfPdfFile[0]
        : listOfPdfFile
    }

    const documentFileUrl = await convertFiletoDataUrl(documentFile)

    uploaderDocument.value = {
      name: documentFile.name,
      type: documentFile.type,
      size: documentFile.size,
      previewUrl: documentFileUrl,
      file: documentFile,
      isUploaded: false,
    }
  } catch (error) {
    console.error('@onDocumentUpload - ERROR', error)
  } finally {
    isProcessingDocument.value = false
  }
}

async function confirmAndUpload() {
  try {
    isUploading.value = true

    if (!uploaderDocument.value) {
      alert('Missing valid document. Please try again.')
      return
    }

    const result = await digiStore.uploadDocument(uploaderDocument.value.file)

    console.log(result)

    const listOfHiddenBox = Object.entries(result.box ?? {}).reduce<Box[]>(
      (acc, [key, box]) => {
        if (listOfHiddenField.includes(key)) {
          acc.push(box)
        }

        return acc
      },
      []
    )

    if (!uploaderDocument.value.previewUrl) {
      throw new Error('MISSING PREVIEW URL')
    }

    const drawedDocumentPreviewUrl = await drawBoxOnImage(
      uploaderDocument.value.previewUrl,
      listOfHiddenBox
    )

    uploaderDocument.value.previewUrl = drawedDocumentPreviewUrl
    uploaderDocument.value.isUploaded = true
  } catch (error) {
    console.error('@onDocumentUpload - ERROR', error)
  } finally {
    isUploading.value = false
  }
}
</script>
