from http.server import SimpleHTTPRequestHandler, HTTPServer
import os

class CleanURLHandler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        # Get the default filesystem path
        original_path = super().translate_path(path)

        # If the requested path exists, return it
        if os.path.exists(original_path):
            return original_path

        # If it does not exist and has no extension, try adding ".html"
        root, ext = os.path.splitext(original_path)
        if ext == "":
            html_path = original_path + ".html"
            if os.path.exists(html_path):
                return html_path

        # Fallback to normal behavior (404)
        return original_path

    def do_POST(self):
        if self.path == '/api/events':
            try:
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                
                # Ensure js directory exists
                if not os.path.exists('js'):
                    os.makedirs('js')
                    
                events_file = os.path.join('js', 'events.json')
                
                # Read existing events or initialize empty list
                import json
                events = []
                if os.path.exists(events_file):
                    with open(events_file, 'r') as f:
                        try:
                            events = json.load(f)
                        except json.JSONDecodeError:
                            pass
                
                # Parse new event
                new_event = json.loads(post_data.decode('utf-8'))
                
                # Add ID if not present
                if 'id' not in new_event:
                    import time
                    new_event['id'] = int(time.time() * 1000)
                
                events.append(new_event)
                
                # Save back to file
                with open(events_file, 'w') as f:
                    json.dump(events, f, indent=2)
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success", "event": new_event}).encode('utf-8'))
                
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": str(e)}).encode('utf-8'))
        else:
            self.send_error(404, "Not Found")

if __name__ == "__main__":
    server = HTTPServer(("0.0.0.0", 8000), CleanURLHandler)
    print("Serving on http://localhost:8000")
    server.serve_forever()

