for file in ['src/pages/Vehicles.jsx', 'src/pages/Routes.jsx', 'src/pages/Alerts.jsx', 'src/pages/Hospitals.jsx']:
    with open(file, 'rb') as f:
        data = f.read()
    
    out = bytearray()
    i = 0
    while i < len(data):
        if data[i] != ord('\r') and data[i] != ord('\n'):
            out.append(data[i])
            i += 1
            if i < len(data) and data[i] == ord('\r'):
                i += 1
            if i < len(data) and data[i] == ord('\n'):
                i += 1
        else:
            out.append(data[i])
            i += 1
            
    text = out.decode('utf-8', errors='ignore')
    
    text = text.replace('`' + 'n', '\n')
    text = text.replace('\n\n\n\n\n', '\n\n')
    text = text.replace('\n\n\n\n', '\n\n')
    text = text.replace('\n\n\n', '\n\n')
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(text)
    
    print(f'Recovered {file}')
