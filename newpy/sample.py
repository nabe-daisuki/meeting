'''This script support until one attachment email'''

import inspect
import sys
import re
from pprint import pprint
from base64 import b64decode

print()

# Get index that first blank in the array.
def getFirstBlankIdx(arr):
    i=0
    while i < len(arr):
        if arr[i] == '': return i
        i+=1

# Get index that first regex hit to the Regex in array.
def getFirstIdxThatHitRegex(arr, regex):
    i=0
    while i < len(arr):
        if re.search(regex, arr[i]) : return i
        i+=1

# Get index that specific end boundary.
def getEndBoundaryIdx(arr, boundary):
    i=0
    while i < len(arr):
        if arr[i] == f'--{boundary}--': return i
        i+=1

# Separate the email per section.
# The rawEmail is email that was retrieved with mbsync.
def separateEmail(rawEmail):
    firstBlankIdx=getFirstBlankIdx(rawEmail)
    headers=rawEmail[0:firstBlankIdx]

    emailContentTypeLine=headers[getFirstIdxThatHitRegex(headers, r'^Content-Type:')]
    emailContentType=re.search(r'^Con.* (.*);', emailContentTypeLine).group(1)
    contentBoundary=re.search(r'="(.*)"', emailContentTypeLine).group(1)
    
    content=rawEmail[firstBlankIdx+1:]

    bodyBoundary=''
    attachmentsBoundary=''
    if emailContentType in ['multipart/mixed', 'multipart/related']:
        contentTypeLineInMixed=content[getFirstIdxThatHitRegex(content, r'^Content-Type:')]
        contentTypeInMixed=re.search(r'^Con.* (.*);', contentTypeLineInMixed).group(1)
        if contentTypeInMixed == 'multipart/alternative':
            bodyBoundary=re.search(r'="(.*)"', contentTypeLineInMixed).group(1)
            attachmentsBoundary=contentBoundary
        else:
            print(str(inspect.currentframe().f_lineno) + r" - Not support email format")
            sys.exit(1)
    
    elif emailContentType == 'multipart/alternative':
        bodyBoundary=contentBoundary
    else:
        print(str(inspect.currentframe().f_lineno) + r" - Not support email format")
        sys.exit(1)
    
    endBodyBoundaryIdx=getEndBoundaryIdx(content, bodyBoundary)
    body=content[getFirstIdxThatHitRegex(content, f'--{bodyBoundary}')+1:endBodyBoundaryIdx]

    attachments=''
    if attachmentsBoundary: attachments=content[endBodyBoundaryIdx+2:-1]
    
    return {
        'headers': headers,
        'body': body,
        'attachments':attachments
    }


# Get email sender.
def getSender(headers):
    senderLine=headers[getFirstIdxThatHitRegex(headers, r'^From:')];
    return re.search(r'<(.*)@', senderLine).group(1)

# Get email subject.
def getSubject(headers):
    subjectLine=headers[getFirstIdxThatHitRegex(headers, r'^Subject')]
    try:
        subject=re.search(r': (.*)', subjectLine).group(1)
    except:
        subject=''
    
    if subjectBuf:= re.search(r'\?UTF-8\?B\?(.*)\?=', subject):
        subject=b64decode(subjectBuf.group(1)).decode()

    return subject


# Whether content is transfered.
def isTransfered(arr):
    return True if len([i for i, x in enumerate(arr) if re.search(r'^Content-Transfer-Encoding:', x)]) else False


# Get email text.
def getTextInBody(body):
    textSection=body[0:getFirstIdxThatHitRegex(body, r'^--')]
    blankIdx=getFirstBlankIdx(textSection)
    textWithoutHeaders=textSection[blankIdx+1:]
    if isTransfered(textSection):
        text=b64decode(''.join(textWithoutHeaders)).decode()
    else:
        text=textWithoutHeaders[0] if len(textWithoutHeaders) == 1 else '\n'.join(textWithoutHeaders)
    
    return text


# Get email html format.
def getHtmlInBody(body):
    htmlSection=body[getFirstIdxThatHitRegex(body, r'^--')+1:]
    blankIdx=getFirstBlankIdx(htmlSection)
    htmlWithoutHeaders=htmlSection[blankIdx+1:]
    if isTransfered(htmlSection):
        html=b64decode(''.join(htmlWithoutHeaders)).decode()
    else:
        html=htmlWithoutHeaders[0] if len(htmlWithoutHeaders) == 1 else '\n'.join(htmlWithoutHeaders)
    
    return html


# Get email attachments, including inline formats.
def getAttachments(attachments):
    try:
        boundaryIdxs=[i for i, x in enumerate(attachments) if re.search(r'^--', x)]
    except Exception as e:
        boundaryIdxs=[]
    boundaryIdxs.append(None)

    i=0
    result=[]
    while i < len(boundaryIdxs):
        result.append({})
        attachmentSection=attachments[boundaryIdxs[i-1] if i != 0 else 0:boundaryIdxs[i]]
        blankIdx=getFirstBlankIdx(attachmentSection)
        attachmentHeaders=attachmentSection[:blankIdx]
        attachmentWithoutHeaders=attachmentSection[blankIdx+1:]
        contentTypeLine=attachmentHeaders[getFirstIdxThatHitRegex(attachmentHeaders, r'^Content-Type:')]

        result[i]['Content-Type']=re.search(r'Type: ([\S]*);', contentTypeLine).group(1)
        if charsetBuf:= re.search(r'charset="(.*)";', contentTypeLine):
            result[i]['charset']=charsetBuf.group(1)
        
        filename=re.search(r'name="(.*)"', contentTypeLine).group(1)
        if filenameBuf:= re.search(r'\?UTF-8\?B\?(.*)\?=', filename):
            filename=b64decode(filenameBuf.group(1)).decode()
        
        result[i]['filename']=filename

        if isTransfered(attachmentHeaders):
            content=b64decode(''.join(attachmentWithoutHeaders))
            with open(result[i]['filename'], 'wb') as f:
                f.write(content)
        else:
            content=attachmentWithoutHeaders[0] if len(attachmentWithoutHeaders) == 1 else '\n'.join(attachmentWithoutHeaders)
        
        result[i]['content']=content

        i+=1
    
    return result


######################################
#
# Start Script
#
######################################


mailFile='1739086512.98806_1.ubuntu,U=16_2,'
mailFile='mail'
ALLOW_SENDER_ACCOUNTS=[
    'atre.moris',
    'sola.addition'
]

f=open(mailFile,'r',encoding='UTF-8')
rawEmail=f.read().splitlines()
f.close()

separatedMail=separateEmail(rawEmail)

sender=getSender(separatedMail['headers'])
if sender in ALLOW_SENDER_ACCOUNTS:
    print('不審なメールです。')
    sys.exit(1)


subject=getSubject(separatedMail['headers'])

text=getTextInBody(separatedMail['body'])

html=getHtmlInBody(separatedMail['body'])

if separatedMail['attachments']:
    attachments=getAttachments(separatedMail['attachments'])

pprint(attachments)
