import os
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

CLIENT_SECRETS_FILE = './ytcreds/client-secret.json'
SCOPES = ['https://www.googleapis.com/auth/youtube', 'https://www.googleapis.com/auth/youtube.upload']

def authenticate():
    flow = InstalledAppFlow.from_client_secrets_file(CLIENT_SECRETS_FILE, SCOPES)
    credentials = flow.run_local_server()
    return credentials

def video_upload():
    credentials = authenticate()
    youtube = build('youtube', 'v3', credentials=credentials)

    video_dir = './videos'
    video_files = [file for file in os.listdir(video_dir) if file.endswith('.mp4')]

    if not video_files:
        print('No video files found in the "videos" directory.')
        return

    for video_file in video_files:
        media_file = MediaFileUpload(os.path.join(video_dir, video_file))

        request_body = {
            'snippet': {
                'title': 'youtube video upload',
                'description': 'testing youtube api to upload a video',
                'categoryId': '10',
                'tags': ['youtube api', 'upload a video'],
            },
            'status': {
                'privacyStatus': 'private',
                'selfDeclaredMadeForKids': False
            },
            'notifySubscribers': False
        }

        try:
            response_video_upload = youtube.videos().insert(
                part='snippet,status',
                body=request_body,
                media_body=media_file
            ).execute(num_retries=5)  

            uploaded_video_id = response_video_upload.get('id')
            print(f'Video {video_file} uploaded! Video ID:', uploaded_video_id)

            os.remove(os.path.join(video_dir, video_file))
            print(f'{video_file} deleted from the "videos" directory.')
        except Exception as e:
            print(f'An error occurred during video {video_file} upload:', e)

if __name__ == "__main__":
    video_upload()


