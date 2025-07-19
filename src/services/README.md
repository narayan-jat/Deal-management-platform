# Services Architecture

This directory contains modular service classes that handle different aspects of the application's business logic.

## Service Classes

### ProfileService
Handles all profile-related database operations.

**Methods:**
- `getProfile(userId: string)` - Fetch profile by user ID
- `updateProfile(userId: string, profileData)` - Update profile data
- `createProfile(userId: string, profileData)` - Create new profile
- `deleteProfile(userId: string)` - Delete profile

### StorageService (Generic)
Core generic storage service that handles file operations across any bucket.

**Core Methods:**
- `uploadFile(userId, file, config)` - Upload file with custom configuration
- `getSignedUrl(filePath, bucket, expiry?)` - Get signed URL for file
- `getPublicUrl(filePath, bucket)` - Get public URL for file
- `deleteFile(filePath, bucket)` - Delete file from bucket
- `updateFile(userId, newFile, config, oldFilePath?)` - Update file
- `listFiles(bucket, folder?)` - List files in bucket folder

**Configuration Interface:**
```typescript
interface StorageConfig {
  bucket: string;
  folder?: string;
  signedUrlExpiry?: number;
  allowedFileTypes?: string[];
  maxFileSize?: number; // in bytes
}
```

### ProfileStorageService
Specific service for profile image operations with predefined configuration.

**Methods:**
- `uploadProfileImage(userId, file)` - Upload profile image
- `getProfileImageSignedUrl(filePath)` - Get signed URL for profile image
- `getProfileImagePublicUrl(filePath)` - Get public URL for profile image
- `deleteProfileImage(filePath)` - Delete profile image
- `updateProfileImage(userId, newFile, oldFilePath?)` - Update profile image
- `listUserProfileImages(userId)` - List all profile images for user

**Configuration:**
- Bucket: `profile-images`
- Folder: `userID`
- Allowed types: JPEG, PNG, GIF, WebP
- Max size: 5MB
- Expiry: 1 hour

### ErrorService
Provides consistent error handling and user-friendly error messages.

**Methods:**
- `logError(error, context)` - Log error with context
- `getUserFriendlyMessage(error)` - Get user-friendly error message
- `handleApiError(error, context)` - Handle API errors consistently


## Architecture Benefits

1. **Separation of Concerns**: Each service handles a specific domain
2. **Reusability**: Services can be used across different components and hooks
3. **Testability**: Services can be easily unit tested in isolation
4. **Maintainability**: Changes to business logic are centralized
5. **Consistency**: Error handling and logging are standardized
6. **Type Safety**: Full TypeScript support with proper typing
7. **Scalability**: Generic storage service supports multiple file types and buckets
8. **Validation**: Built-in file type and size validation
9. **Configuration Management**: Each service type has its own configuration
10. **Single Responsibility**: Generic service handles core operations, specific services handle domain logic