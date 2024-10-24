import os

def update_purchase_status_to_in_progress(db, purchase_id: int):
    query = """
        UPDATE video_purchases 
        SET video_status = 'in-progress'
        WHERE id = %s AND video_status = 'pending'
    """
    cursor = db.cursor()
    cursor.execute(query, (purchase_id,))
    db.commit()
    cursor.close()

def get_pending_video(db):
    query = """
        SELECT id, voice_path
        FROM video_purchases 
        WHERE video_status = 'pending'
        LIMIT 1
    """
    cursor = db.cursor()
    cursor.execute(query)
    pending_purchase = cursor.fetchone()
    cursor.close()
    return pending_purchase


def get_files_for_video(db, purchase_id: int):
    query = """
        SELECT file_type, file_path 
        FROM video_files 
        WHERE purchase_id = %s
    """
    cursor = db.cursor()
    cursor.execute(query, (purchase_id,))
    files = cursor.fetchall()
    cursor.close()
    return files


def save_final_video(db, purchase_id: int, final_video_path: str, receiver_phone: str, send_date: str):
    query = """
        INSERT INTO final_videos (purchase_id, final_video_path, receiver_phone, send_date)
        VALUES (%s, %s, %s, %s)
    """
    cursor = db.cursor()
    cursor.execute(query, (purchase_id, final_video_path, receiver_phone, send_date))
    db.commit()
    cursor.close()


def update_purchase_status(db, purchase_id: int, status: str):
    query = """
        UPDATE video_purchases 
        SET video_status = %s 
        WHERE id = %s
    """
    cursor = db.cursor()
    cursor.execute(query, (status, purchase_id))
    db.commit()
    cursor.close()


def generate_video(files, output_directory):
    print(f"Generating video with {len(files)} files...")
    return os.path.join(output_directory, "final_video.mp4")