#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <locale.h>
#include <wchar.h>

int connect_smtp(const char* host, int port);
void send_smtp(int sock, const char* msg, char* resp, size_t len);

int connect_smtp(const char* host, int port);
void send_smtp(int sock, const char* msg, char* resp, size_t len);



/*
  Use the provided 'connect_smtp' and 'send_smtp' functions
  to connect to the "lunar.open.sice.indian.edu" smtp relay
  and send the commands to write emails as described in the
  assignment wiki.
 */
int main(int argc, char* argv[]) {
  if (argc != 3) {
    printf("Invalid arguments - %s <email-to> <email-filepath>", argv[0]);
    return -1;
  }
  char* rcpt = argv[1];
  char* filepath = argv[2];
  setlocale(LC_ALL, "en_US.UTF-8"); 
  FILE* ptr;
  // wchar_t c;
  char body[1024];
  ptr = fopen(filepath, "r");
  if (NULL == ptr) {
        printf("file can't be opened \n");
        return -1;
    }
  char ch;
  int i=0;
  // while ((c = fgetwc(ptr)) != WEOF){
  //       char cToStr[2];
  //       cToStr[1] = '\0';
  //       cToStr[0] = c;
  //       strcat(body,cToStr);
  // } 
  while (!feof(ptr)){
    ch=fgetwc(ptr);
    body[i]=ch;
    i++;
  }
  // printf("%d\n",i);
  body[--i]='\0';
  fclose(ptr);
  int l = strlen(body);
  // printf("%d\n",l);
  char telnetServer[] = "lunar.open.sice.indiana.edu";
  int port = 25;
  int socket  = connect_smtp(telnetServer,port);
  char response[4096];
  strcat(body,"\r\n.\r\n"); 
  send_smtp(socket, "HELO iu.edu\n", response, 4096);
  // printf("response: %s\n", response);
  char mail_from[40] = "MAIL FROM: ";
  strcat(mail_from,rcpt);
  strcat(mail_from,"\n");
  send_smtp(socket, mail_from, response, 4096);
  // printf("MAIL FROM : %s\n",response);
  char rcptto[40] = "RCPT TO: ";
  strcat(rcptto,rcpt);
  strcat(rcptto,"\n");
  send_smtp(socket, rcptto, response, 4096);
  // printf("RCPT TO : %s\n",response);
  send_smtp(socket, "DATA\n", response, 4096);
  send_smtp(socket, body, response, 4096);
  printf("%s",response);

  char* rcpt = argv[1];
  char* filepath = argv[2];

  /* 
     STUDENT CODE HERE
   */
  
  return 0;
}